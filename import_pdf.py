import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

# URL сторінки зі звітами
base_url = "https://yevshan.com.ua/reports"

# Отримуємо HTML сторінки
response = requests.get(base_url)
response.raise_for_status()

soup = BeautifulSoup(response.text, "html.parser")

# Створюємо папку для збереження PDF
os.makedirs("pdf_reports", exist_ok=True)

# Шукаємо всі посилання на PDF
for link in soup.find_all("a", href=True):
    href = link["href"]
    if href.endswith(".pdf"):
        pdf_url = urljoin(base_url, href)
        file_name = os.path.basename(href)
        file_path = os.path.join("pdf_reports", file_name)

        print(f"⬇️ Завантаження: {pdf_url}")
        pdf_data = requests.get(pdf_url)
        with open(file_path, "wb") as f:
            f.write(pdf_data.content)

print("✅ Усі PDF-документи завантажено в папку 'pdf_reports'")
