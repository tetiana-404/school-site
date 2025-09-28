import os
import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

BASE_URL = "https://yevshan.com.ua"
MIN_YEAR = 2025  # тільки новини після цього року

def get_news_links(quan=10):
    """Отримує список новин через POST-запит до loadNews.php"""
    try:
        res = requests.post(
            urljoin(BASE_URL, "php/functions/loadNews.php"),
            data={"quan": quan}
        )
        # Виправлення некоректних символів у JSON
        text = res.text.replace('\n', '').replace('\r', '')
        data = json.loads(text)
        # news_links збираємо з data['left'] та data['right'] як HTML
        soup_left = BeautifulSoup(data.get("left", ""), "html.parser")
        soup_right = BeautifulSoup(data.get("right", ""), "html.parser")
        links = []
        for a_tag in soup_left.find_all("a") + soup_right.find_all("a"):
            href = a_tag.get("href")
            if href:
                full_url = urljoin(BASE_URL, href)
                links.append(full_url)
        return links
    except Exception as e:
        print("❌ Помилка при отриманні новин:", e)
        return []

def get_news_details(news_url):
    """Отримує деталі новини"""
    try:
        res = requests.get(news_url)
        if res.status_code != 200:
            print(f"Помилка доступу до {news_url}")
            return None
        soup = BeautifulSoup(res.text, "html.parser")
        title_div = soup.find("div", class_="content-post-title")
        title = title_div.text.strip() if title_div else "Без заголовка"

        updateDate_div = soup.find("div", class_="content-post-info-date")
        updateDate = updateDate_div.text.strip() if updateDate_div else "0000-00-00"

        # Перевірка року
        try:
            year = int(updateDate.split('.')[-1])
            if year < MIN_YEAR:
                return None
        except:
            pass

        fb_root_div = soup.find("div", id="fb-root")
        content = []
        current = title_div.find_next_sibling() if title_div else None
        while current and current != fb_root_div:
            content.append(str(current))
            current = current.find_next_sibling()
        full_content_html = "\n".join(content)

        return {"title": title, "full_text": full_content_html, "updateDate": updateDate, "url": news_url}
    except Exception as e:
        print(f"❌ Помилка при парсингу {news_url}: {e}")
        return None

def export_to_json(news_list, filename="news_after_2025.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(news_list, f, ensure_ascii=False, indent=4)
    print(f"✅ Збережено {len(news_list)} новин у {filename}")

def download_image(url, folder="images"):
    try:
        if not os.path.exists(folder):
            os.makedirs(folder)
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            filename = os.path.join(folder, url.split("/")[-1])
            with open(filename, "wb") as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Зображення завантажено: {filename}")
        else:
            print(f"Не вдалося завантажити {url}")
    except Exception as e:
        print(f"Помилка при завантаженні зображення {url}: {e}")

def get_images_from_post(post_url):
    """Завантажує всі зображення з посту"""
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

def download_all_images(all_news):
    print("📥 Починаємо завантаження зображень...")
    downloaded = set()
    for post in all_news:
        post_url = post["url"]
        print(f"Збираємо зображення з: {post_url}")
        images = get_images_from_post(post_url)
        for img_url in images:
            if img_url not in downloaded:
                download_image(img_url)
                downloaded.add(img_url)
    print(f"✅ Завантажено {len(downloaded)} унікальних зображень")

def fetch_all_news():
    all_news = []
    quan = 10
    print("Старт експорту новин…")
    while True:
        print(f"Запит {quan} новин…")
        links = get_news_links(quan=quan)
        if not links:
            break
        new_news = []
        for url in links:
            if url not in [n["url"] for n in all_news]:
                details = get_news_details(url)
                if details:
                    new_news.append(details)
        if not new_news:
            break
        all_news.extend(new_news)
        print(f"Завантажено новин: {len(all_news)}")
        quan += 10
    export_to_json(all_news)
    download_all_images(all_news)

if __name__ == "__main__":
    fetch_all_news()
