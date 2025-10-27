import json
import os
import requests
from bs4 import BeautifulSoup

BASE_URL = "https://yevshan.com.ua"

def get_news_links(limit=20):
    """Отримує всі посилання на детальні сторінки новин."""
    response = requests.get(BASE_URL)
    if response.status_code != 200:
        print("Помилка доступу до сайту")
        return []
    
    soup = BeautifulSoup(response.text, "html.parser")
    news_links = []
    
    for article in soup.select(".content-postbox .content-post .content-post-title a")[:limit]:  # Шукаємо заголовки новин
        href = article.get("href")
        
        if not href or href.startswith("http"):  
            continue

        if not href.startswith("/"):  
            href = "/" + href
        full_url = BASE_URL + href
        news_links.append(full_url)

    return news_links

def get_news_details(news_url):
    """Отримує заголовок, короткий опис та повний текст новини."""
    response = requests.get(news_url)
    if response.status_code != 200:
        print(f"Помилка завантаження {news_url}")
        return None
    
    soup = BeautifulSoup(response.text, "html.parser")

    title_div = soup.find("div", class_="content-post-title")  # Отримуємо сам <div>
    title = title_div.text.strip() if title_div else "Без заголовка"
    updateDate = soup.find("div", class_="content-post-info-date").text.strip()
    fb_root_div = soup.find("div", id="fb-root")
    
    content = []
    current = title_div.find_next_sibling()

    while current and current != fb_root_div:
        content.append(str(current))  # Зберігаємо як HTML-рядок
        current = current.find_next_sibling()

    full_content_html = "\n".join(content)

    return {"title": title, "full_text": full_content_html, "updateDate": updateDate, "url": news_url}

def export_to_json(news_list, filename="news_old.json"):
    """Експортує список новин у JSON-файл."""
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(news_list, f, ensure_ascii=False, indent=4)
    print(f"✅ Успішно збережено {len(news_list)} новин у {filename}")

def download_image(url, folder="images"):
    """Завантажує зображення за URL."""
    try:
        # Створення папки, якщо вона не існує
        if not os.path.exists(folder):
            os.makedirs(folder)

        response = requests.get(url, stream=True)
        if response.status_code == 200:
            # Отримуємо ім'я файлу з URL
            filename = os.path.join(folder, url.split("/")[-1])
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Зображення завантажено: {filename}")
        else:
            print(f"Не вдалося завантажити {url}")
    except Exception as e:
        print(f"Помилка при завантаженні зображення {url}: {e}")

def get_images_from_post(post_url):
    """Отримує всі зображення з конкретного посту."""
    response = requests.get(post_url)
    if response.status_code != 200:
        print(f"Помилка доступу до новини {post_url}")
        return []
    
    soup = BeautifulSoup(response.text, "html.parser")
    images = []

    # Збираємо всі зображення
    for img_tag in soup.find_all("img"):
        img_url = img_tag.get("src")
        if img_url:
            if img_url.startswith("/"):
                img_url = BASE_URL + img_url  # Робимо абсолютний URL
            images.append(img_url)
    
    return images

def download_all_images():
    """Завантажує всі зображення з новин."""
    news_links = get_news_links(limit=10)  # Збираємо 10 новин
    for link in news_links:
        print(f"Збираємо зображення з новини: {link}")
        images = get_images_from_post(link)
        for img_url in images:
            download_image(img_url)

def main():
    print("Start export")
    news_links = get_news_links()
    all_news = []

    for link in news_links:
        news_data = get_news_details(link)
        if news_data:
            all_news.append(news_data)

    #download_all_images()

    if all_news:
        export_to_json(all_news)
    


if __name__ == "__main__":
    main()
