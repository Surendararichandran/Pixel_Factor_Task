from flask import g, request
from datetime import datetime
import sqlite3
from utils_py import server_response

def apply_job_old():
    user_data_from_token = g.current_user
    now = datetime.now()
    formatted = now.strftime("%Y-%m-%d %H:%M:%S")

    name = user_data_from_token.get("name")
    email = user_data_from_token.get("email")
    position = request.json.get("position")  # Assuming this is sent in POST body

    save_application(name, email, position, formatted)
    
    
    return server_response()

def save_application(name, email, position, date):
    conn = sqlite3.connect("job_applied.db")
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS application (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            position_applied TEXT NOT NULL,
            application_date TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        INSERT INTO application (name, email, position_applied, application_date)
        VALUES (?, ?, ?, ?)
    ''', (name, email, position, date))
    conn.commit()
    conn.close()
