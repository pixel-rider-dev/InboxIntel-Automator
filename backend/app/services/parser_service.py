import PyPDF2

def extract_text_from_file(file):
    filename = file.filename.lower()
    
    # PDF Parsing
    if filename.endswith('.pdf'):
        try:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        except Exception as e:
            print(f"PDF Parsing Error: {e}")
            return None
            
    # For MVP, we will treat other files as plain text or ignore
    # (OCR & Whisper integration will be added here in phase 2)
    return file.read().decode('utf-8', errors='ignore')