import os
import json
import csv
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import httpx

# === SETUP ===
FOLDER_PATH = './assets'
CSV_OUTPUT = 'parsed_receipts_gemini_openrouter.csv'
OPENROUTER_API_KEY = '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'

PROMPT = """
Extract the following fields from this receipt:
- Date
- Total Amount
- Tax Amount
- Payment Method
- Vendor Name
- Receipt Number (if available)

Make sure your response is valid JSON with these keys.

Receipt Text:
{receipt_text}
"""

# === FUNCTIONS ===

def extract_text_from_file(file_path):
    ext = file_path.lower().split('.')[-1]
    text = ''
    try:
        if ext == 'pdf':
            images = convert_from_path(file_path)
            for img in images:
                text += pytesseract.image_to_string(img) + '\n'
        else:
            img = Image.open(file_path)
            text = pytesseract.image_to_string(img)
    except Exception as e:
        print(f"OCR error on {file_path}: {e}")
    return text.strip()

def ask_openrouter(prompt):
    try:
        url = "https://openrouter.ai/api/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://maserat.ca",     # Optional, for OpenRouter free use policy
            "X-Title": "ReceiptParser"
        }
        data = {
            "model": "mistralai/mixtral-8x7b",
            "messages": [{"role": "user", "content": prompt}]
        }
        response = httpx.post(url, headers=headers, json=data)
        if response.status_code != 200:
            print("[OpenRouter Gemini] API error:", response.status_code, response.text)
            return {}

        result = response.json()
        content = result['choices'][0]['message']['content']
        return json.loads(content)
    except Exception as e:
        print(f"[OpenRouter Gemini] Error: {e}")
        return {}

def save_to_csv(path, data):
    with open(path, "a", newline="") as f:
        writer = csv.writer(f)
        if f.tell() == 0:
            writer.writerow(["File", "Date", "Total", "Tax", "Payment Method", "Vendor", "Receipt Number"])
        writer.writerow([
            data.get("File", ""),
            data.get("Date", ""),
            data.get("Total Amount", ""),
            data.get("Tax Amount", ""),
            data.get("Payment Method", ""),
            data.get("Vendor Name", ""),
            data.get("Receipt Number", "")
        ])

# === MAIN ===

def run():
    os.makedirs(FOLDER_PATH, exist_ok=True)
    for filename in os.listdir(FOLDER_PATH):
        path = os.path.join(FOLDER_PATH, filename)
        if not os.path.isfile(path):
            continue

        print(f"Processing: {filename}")
        text = extract_text_from_file(path)
        if not text:
            print(f"Skipped (no text): {filename}")
            continue

        prompt = PROMPT.format(receipt_text=text)
        result = ask_openrouter(prompt)
        result["File"] = filename
        save_to_csv(CSV_OUTPUT, result)

if __name__ == "__main__":
    run()