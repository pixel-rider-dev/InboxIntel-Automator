import os
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'wav', 'mp3'}

def allowed_file(filename):
    """
    Check karta hai ke file ki extension humari allowed list mein hai ya nahi.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file, upload_folder):
    """
    File ka naam secure kar ke usay temporary folder mein save karta hai.
    """
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Ensure upload folder exists
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)
        return file_path
    return None