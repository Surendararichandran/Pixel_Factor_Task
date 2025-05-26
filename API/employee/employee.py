from flask import  request, jsonify
import sqlite3
from utils_py.responseDataFormate import server_response;
from API.allJobsList import alljobs
def employee_posted_job_lists():
    print(request.headers)
    tpl = alljobs()
    print(f"\n allJobs : {tpl}\n")
    return tpl
    # SLECT * From employee_jobs_list;
    
def employee_create_job_post():
    
    data = request.json
    title = data.get('title')
    company = data.get('company')
    location = data.get('location')
    description = data.get('description')

    if not title or not company or not location or not description:
        # return jsonify({'message': 'All fields are required'}), 400
        return  server_response(400,'All fields are required')

    conn = sqlite3.connect('jobs.db')
    c = conn.cursor()
    c.execute("INSERT INTO jobs (title, company, location, description) VALUES (?, ?, ?, ?)", 
            (title, company, location, description))
    conn.commit()
    conn.close()

    # return jsonify({'message': 'Job posted successfully!'}), 201
    return server_response(201,"Job posted successfully!")
    
# INSERT INTO employee_jobs_list column VALUES column_values


