
from flask import request
import sqlite3
from utils_py.responseDataFormate import server_response
from DB.db_helper import select_sql
"""
location,keyword,company
"""
def search():
    data:dict = request.json()
    if not data:
        return server_response(406,"Server needs data to search")
    jobs_found = select_sql(data)
    return server_response(response_data=jobs_found)




      