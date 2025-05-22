from flask import  request, jsonify
import sqlite3

def register_api():
    data = request.json
    username = data.get('userName')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')

    if not username or not email or not password or not role:
        return jsonify({'message': 'All fields are required'}), 400

    try:
        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        c.execute("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
                  (username, email, password, role))
        conn.commit()
        conn.close()
        return jsonify({'message': 'Registration successful!'}), 201
    
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Email already registered'}), 400