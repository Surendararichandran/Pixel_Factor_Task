import jwt
from flask import request, jsonify, g
from functools import wraps
from datetime import datetime, timedelta

SECRET_KEY = "JobSeekerPortal"

def create_jwt(payload, expires_in=30):
    payload['exp'] = datetime.utcnow() + timedelta(minutes=expires_in)
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_jwt(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return decoded
    except jwt.ExpiredSignatureError:
        return {"error": "Token has expired"}
    except jwt.InvalidTokenError:
        return {"error": "Invalid token"}




def jwt_required_custom(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None

        # 1. Try to get token from Authorization header
        auth_header = request.headers.get('Authorization', None)
        if auth_header:
            token = auth_header.split(" ")[1] if " " in auth_header else auth_header
        
        # 2. If no header, try cookie
        if not token:
            token = request.cookies.get('jwt_token')

        if not token:
            return jsonify({"error": "Authorization token missing"}), 401

        decoded = decode_jwt(token)

        if "error" in decoded:
            return jsonify(decoded), 401

        # Store user info globally using Flask's `g`
        g.current_user = decoded.get("user")
        return f(*args, **kwargs)
    
    return decorated_function
