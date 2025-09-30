import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import os

BASE_URL = "https://yevshan.com.ua"
TARGET_START = (1, 1, 2025)   # 01.01.2025
TARGET_END = (31, 8, 2025)    # 31.08.2025

def date_in_range(updateDate):
    try:
        day, month, year = map(int, updateDate.split("."))
        if (year < TARGET_START[2]) or (year > TARGET_END[2]):
            return False
        if year == TARGET_START[2] and (month < TARGET_START[1] or (month == TARGET_START[1] and day < TARGET_START[0])):
            return False
        if year == TARGET_END[2] and (month > TARGET_END[1] or (month == TARGET_END[1] and day > TARGET_END[0])):
            return False
        return True
    except:
        return False

def get_news_batch(quan=10):
    """Отримує одну порцію новин (loadNews.php)"""
    try:
        res = requests.post(urljoin(BASE_URL, "php/functions/loadNews.php"), data={"quan": quan})
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")
        posts = []

        for post_div in soup.find_all("div", class_="content-post"):
            try:
                post_id = post_div.get("data-id")
                title_div = post_div.find("div", class_="content-post-title")
                title = title_div.get_text(strip=True) if title_div else "Без назви"
                date_div = post_div.find("div", class_="content-post-info-date")
                updateDate = date_div.get_text(strip=True) if date_div else "0000-00-00"
                more_link = post_div.find("div", class_="content-post-continue")
                url = urljoin(BASE_URL, more_link.find("a")["href"]) if more_link and more_link.find("a") else None

                posts.append({
                    "id": post_id,
                    "title": title,
                    "updateDate": updateDate,
                    "url": url
                })
            except Exception as e:
                print(f"❌ Помилка парсингу посту: {e}")

        return posts
    except Exception as e:
        print(f"❌ Помилка при отриманні новин: {e}")
        return []

def get_full_content(news_url):
    """Отримуємо повний контент новини з її сторінки"""
    try:
        res = requests.get(news_url)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        content_divs = soup.find_all("div", class_="news-text")
        photos = soup.find_all("div", class_="news-photo")

        parts = []
        for c in content_divs:
            parts.append(str(c))
        for ph in photos:
            # змінюємо шлях для локальної папки React
            for img in ph.find_all("img"):
                img["src"] = "/school-site/photo/news-images/" + os.path.basename(img["src"])
            parts.append(str(ph))

        return "\n".join(parts)
    except Exception as e:
        print(f"❌ Помилка завантаження контенту {news_url}: {e}")
        return ""

def fetch_all_news():
    all_news = []
    offset = 10

    print("Старт експорту новин…")
    while True:
        posts = get_news_batch(offset)
        if not posts:
            break

        new_posts = []
        for post in posts:
            if post["url"] and post["url"] not in [n["url"] for n in all_news]:
                if date_in_range(post["updateDate"]):
                    content = get_full_content(post["url"])
                    post["content"] = content
                    new_posts.append(post)

        if not new_posts:
            break

        all_news.extend(new_posts)
        print(f"Завантажено новин: {len(all_news)}")
        offset += 10

    # збереження у файл
    filename = "news_jan_aug_2025.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(all_news, f, ensure_ascii=False, indent=4)
    print(f"✅ Збережено {len(all_news)} новин у {filename}")

if __name__ == "__main__":
    fetch_all_news()
