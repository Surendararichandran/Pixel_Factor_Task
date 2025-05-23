from flask import  request, jsonify,make_response
import sqlite3
from JWT.jwt import create_jwt

def login_api():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({
            'message': 'Email and password are required',
            'data': None
        }), 400

    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE email=? AND password=?", (email, password))
    user = c.fetchone()
    conn.close()

    if user:
        user_id = user[0]
        user_email = user[1]
        user_role = user[-1]

        token = create_jwt({'user_id': user_id, 'email': user_email, 'role': user_role})

        response_body = {
            'message': 'Login successful',
            'data': {
                'id': user_id,
                
                'role': user_role
            }
        }

        response = make_response(jsonify(response_body), 200)
        response.headers['Authorization'] = f'Bearer {token}'
        response.set_cookie(
        'jwt_token', token,
        httponly=True,    # not accessible via JS
        secure=False,      # only over HTTPS (use False for localhost/dev)
        samesite='Strict' # adjust based on your needs
    )
        
    return response

    return jsonify({
        'message': 'Invalid credentials',
        'data': None
    }), 401    
   