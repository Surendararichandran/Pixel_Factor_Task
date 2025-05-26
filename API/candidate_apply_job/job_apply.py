# candidate_apply_jobs/job_apply.py
from flask import request,g
import sqlite3
from utils_py.responseDataFormate import server_response
from DB.db_helper import select_sql
# moved this variable to global scope to avoid multipule and unnecessary select Query 
job_list = select_sql("all","jobs.db","jobs")
def apply_job():
    user_data_from_token = g.current_user
    data = request.json
    user_id = user_data_from_token.get("user_id")
    data["user_id"] = user_id
    create_table()
    success = insert_table(data=data)
    print("Data to Insert : " ,data)
    if not success:
        return server_response(500,"Internal Server Error")
    updated_job_list = update_job_list_to_current_user(job_id=data["job_id"])
    return server_response(response_data={"jobs":updated_job_list})

def update_job_list_to_current_user(job_id):
    filtered_jobs = [job for job in job_list if job_id not in job]
    dict_jobs = jobs_tuple_to_dict(filtered_jobs)
    print(dict_jobs)
    return dict_jobs

def jobs_tuple_to_dict(jobs):
    keys = ["id", "title", "company", "location", "description"]
    return [dict(zip(keys, job)) for job in jobs]


def insert_table(data:dict):
    try:
        conn=sqlite3.connect("applications.db")
        cursor=conn.cursor()
        query= "INSERT INTO applications"
        columns = ', '.join(data.keys())
        placeholders = ', '.join(['?'] * len(data))
        values = list(data.values())
        query += f" ({columns}) VALUES ({placeholders}) "
        cursor.execute(query,values)
        conn.commit()
        return True
    except sqlite3.Error as e:
        print(f"FROM job_apply at insert_table An error occurred: {e}")
        if conn:
            conn.rollback()
        return False
    finally:
        if conn:
            conn.close()

def create_table():
    try:
        conn=sqlite3.connect("applications.db")
        cursor=conn.cursor()
        cursor.execute("""
                        CREATE TABLE IF NOT EXISTS applications (
                user_id int,
                job_id int,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (job_id) REFERENCES jobs(id)
            )""")
        conn.commit()
    except sqlite3.Error as db_err:
        print(f"An Error Occurred : {db_err} ")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()
