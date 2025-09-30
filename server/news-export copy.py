import os
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://yevshan.com.ua"
NEWS_URL = BASE_URL + "/news"
IMG_FOLDER = "photo/news-images/"

os.makedirs(IMG_FOLDER, exist_ok=True)

new_news = []
failed_news = []

TARGET_MONTH = "01"
TARGET_YEAR = "2020"

def get_all_news():
    all_posts = []
    offset = 0
    while True:
        try:
            res = requests.post(
                urljoin(BASE_URL, "php/functions/loadNews.php"),
                data={"quan": offset}
            )
            res.raise_for_status()
            soup = BeautifulSoup(res.text, "html.parser")
            page_posts = []

            for post_div in soup.find_all("div", class_="content-post"):
                try:
                    post_id = post_div.get("data-id")
                    title_div = post_div.find("div", class_="content-post-title")
                    title = title_div.get_text(strip=True) if title_div else "Без назви"
                    date_div = post_div.find("div", class_="content-post-info-date")
                    updateDate = date_div.get_text(strip=True) if date_div else "0000-00-00"
                    more_link = post_div.find("div", class_="content-post-continue")
                    url = urljoin(BASE_URL, more_link.find("a")["href"]) if more_link and more_link.find("a") else None

                    day, month, year = map(int, updateDate.split("."))
                    
                    if year > int(TARGET_YEAR):
                        continue 

                    page_posts.append({
                        "id": post_id,
                        "title": title,
                        "updateDate": updateDate,
                        "url": url
                    })
                except Exception as e:
                    print(f"❌ Помилка при парсингу посту: {e}")

            if not page_posts:
                break  # більше новин нема, виходимо з циклу

            all_posts.extend(page_posts)
            offset += 10  # далі беремо наступні 10
        except Exception as e:
            print(f"❌ Помилка при отриманні новин: {e}")
            break

    print(f"Завантажено новин: {len(all_posts)}")
    return all_posts

def get_full_content(news_url):
    """Отримуємо контент новини з її сторінки"""
    try:
        res = requests.get(news_url)
        res.raise_for_status()
        soup = BeautifulSoup(res.text, "html.parser")

        content_div = soup.find_all("div", class_="news-text")
        photos = soup.find_all("div", class_="news-photo")

        parts = []
               
        for div in content_div:
            html = str(div)
            parts.append(html)

        for ph in photos:
            html = str(ph)
            html = html.replace('src="/photo/news-images/', 'src="/school-site/photo/news-images/')
            parts.append(html)

        return "\n".join(parts)
    except Exception as e:
        print(f"❌ Помилка при завантаженні контенту {news_url}: {e}")
        return ""

def download_image(url, folder=IMG_FOLDER):
    """Завантажуємо одне зображення"""
    try:
        if not os.path.exists(folder):
            os.makedirs(folder)
        filename = os.path.join(folder, url.split("/")[-1])
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(filename, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Зображення завантажено: {filename}")
        else:
            print(f"Не вдалося завантажити {url}")
    except Exception as e:
        print(f"Помилка при завантаженні зображення {url}: {e}")


def get_images_from_post(post_url):
    """Повертає список всіх зображень у пості"""
    try:
        res = requests.get(post_url)
        if res.status_code != 200:
            print(f"Помилка доступу до новини {post_url}")
            return []
        soup = BeautifulSoup(res.text, "html.parser")
        images = []
        for img_tag in soup.find_all("img"):
            img_url = img_tag.get("src")
            if img_url:
                full_img_url = urljoin(BASE_URL, img_url)
                images.append(full_img_url)
        return images
    except Exception as e:
        print(f"Помилка при отриманні зображень з {post_url}: {e}")
        return []


def fetch_all_news():
    all_news = []
    quan = 10
    print("Старт експорту новин…")

    while True:
        print(f"Запит {quan} новин…")
        posts = get_all_news()
        if not posts:
            break

        new_news = []
        for post in posts:
            if post["url"] and post["url"] not in [n["url"] for n in all_news]:
                content = get_full_content(post["url"])
                post["content"] = content
                new_news.append(post)

                #images = get_images_from_post(post["url"])
                #for img_url in images:
                    #download_image(img_url)

        if not new_news:
            break

        all_news.extend(new_news)
        print(f"Завантажено новин: {len(all_news)}")
        quan += 10

    # збереження у файл
    filename = "news_after_2025.json"
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(all_news, f, ensure_ascii=False, indent=4)
    print(f"✅ Збережено {len(all_news)} новин у {filename}")

if __name__ == "__main__":
    fetch_all_news()
    