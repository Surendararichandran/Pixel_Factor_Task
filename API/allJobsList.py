from DB.db_helper import select_sql
from flask import g
from utils_py.responseDataFormate import server_response
import json
def alljobs():
    
    # jobs = 
    # [dict(zip(columns, row)) for row in rows]
    jobs = filter_jobs()
    print("\n\n jobs : ",jobs)
    return server_response(response_data=jobs)

# return the job list that the user hasn't applied and remove or ignore or filter the applied jobs 
def filter_jobs():
    
    user_id = g.current_user.get("user_id")

    # Get all job applications by this user
    data_dict = {"user_id": user_id}
    applied_jobs = select_sql(data_dict, "applications.db", "applications", as_dict=True)
    print("\n\n applied jobs  :",applied_jobs)
        
    # Get all jobs
    all_jobs = select_sql("all", "jobs.db", "jobs", as_dict=True)
    print("\n\n all_jobs :",all_jobs)
    
    if not applied_jobs:
        return {"jobs": all_jobs}
    
    # Extract job_ids the user has applied to
    applied_job_ids = {job["job_id"] for job in applied_jobs}
    
    # Filter jobs user hasn't applied to
    unapplied_jobs = [job for job in all_jobs if job["id"] not in applied_job_ids]

    return {"jobs": unapplied_jobs}

def jobs_tuple_to_dict(jobs):
    keys = ["id", "title", "company", "location", "description"]
    return [dict(zip(keys, job)) for job in jobs]

