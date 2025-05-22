import sqlite3
from utils_py.responseDataFormate import server_response
import json
def alljobs():
    conn=sqlite3.connect('jobs.db')
    cursor = conn.cursor()
    
    cursor.execute("select * from jobs")
    columns = [desc[0] for desc in cursor.description]
    rows = cursor.fetchall()
    
    conn.close()
    jobs = [dict(zip(columns, row)) for row in rows]
    # ffetch all the jobs from t eh jobs.db
    print(jobs)
    return server_response(response_data={"jobs":jobs})