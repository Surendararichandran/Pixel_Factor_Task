from flask import Flask, request, jsonify,render_template,url_for,session,redirect,make_response
from flask_cors import CORS
import sqlite3
from API.login import login_api
from API.register import register_api
from API.employee.employee import employee_create_job_post,employee_posted_job_lists
from API.allJobsList import alljobs
from JWT.jwt import jwt_required_custom
from  pathlib import Path
from flask_wtf import CSRFProtect
from API.candidate_apply_job.job_apply import apply_job
from API.search.search_api import search
import os

BASE_URL = Path(__file__).parent.resolve()

app = Flask(__name__,static_folder=str(BASE_URL / "static")
            ,static_url_path="/static", template_folder=str(BASE_URL / "templates"))

# csrf.
csrf = CSRFProtect()
app.config['WTF_CSRF_ENABLED'] = False
# app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

CORS(app, supports_credentials=True, expose_headers=["Authorization"],
    allow_headers=["Content-Type", "Authorization"])



@app.after_request
def set_content_type(response):
    if response.is_json:
        response.headers["Content-Type"] = "application/json"
    return response
# Database initialization
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


init_db()

def jobs_db():
    conn = sqlite3.connect('jobs.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

jobs_db()

@app.route("/")
# @jwt_required_custom
def home():
    return render_template("index.html")


@app.route("/api/register",methods=["POST"])

def api_wrapper():
    return register_api()
    

@app.route('/register', methods=["GET"])
def register():
    return render_template("register.html", register_script=static_file_path_genarator("scripts/register.js"),
                           gutils=static_file_path_genarator("utils/gutils.js"))
    

@app.route('/api/login',methods = ["POST"])
def api_wraper():
    return login_api()

@app.route('/login', methods=["GET"])
def login():
    print(request)
    return render_template("login.html",login_script=static_file_path_genarator("scripts/login.js"),
                               gutils=static_file_path_genarator("utils/gutils.js"))
    
def static_file_path_genarator(file_name):
    file_url= url_for("static",filename =file_name)
    print(file_url)
    return file_url

@app.route("/jobseeker",methods=["GET"])
@jwt_required_custom
def jobseeker_Template():
    print("\n\n From JobSeeker : \n\n",request)
    return render_template("jobSeeker.jobList.html",job_seeker_js=static_file_path_genarator("scripts/jobSeeker.joblist.js"),
                        gutils=static_file_path_genarator("utils/gutils.js")   )
"""
@app.route('/')
def job_list_page():
    return render_template('joblists.html')
"""
@app.route('/api/jobs', methods=['GET'])
@jwt_required_custom
def get_jobs():
    conn = sqlite3.connect('jobs.db')
    c = conn.cursor()
    c.execute("SELECT * FROM jobs")
    jobs = [{'id': row[0], 'title': row[1], 'company': row[2], 'location': row[3]} for row in c.fetchall()]
    conn.close()
    return jsonify(jobs)


@app.route('/job-post')
@jwt_required_custom
def job_post_page():
    return render_template('employee.jobPost.html',recruiter_new_job_post=static_file_path_genarator("scripts/employee.jobPost.js"), gutils=static_file_path_genarator("utils/gutils.js"))

@app.route('/recruter',methods = ["GET"])
@jwt_required_custom
def job_posted_list_page():
    return render_template('employee.jobPostedList.html',recruiter_posted_job_list=static_file_path_genarator("scripts/employee.JobPostList.js"),
                        gutils=static_file_path_genarator("utils/gutils.js"))


@app.route('/api/post-job', methods=['POST'])
def post_job():
    return employee_create_job_post()
   


@app.route("/api/loadJobsList",methods=["GET"])
@jwt_required_custom
def load_all_jobs():
  data =  employee_posted_job_lists()
  print(data)
  return data

@app.route("/api/alljobs",methods=["GET"])
@jwt_required_custom
def load_employee_posted_jobs():
  data =  employee_posted_job_lists()
  print(data)
  return data

# @app.route("/api/applyJobs",methods=["POST"])
# @jwt_required_custom
# def apply_jobs_pattadhari():
#     return apply_job()

@app.route('/api/logout',methods=["POST"])
def logout():
    session.pop('user', None)
    response = make_response()
    response.delete_cookie('jwt_token',path="/")
    response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return redirect(url_for('login_page'))



@app.route('/api/search_jobs',methods=["POST"])
def jobs_filter():
    return search()



# Route to apply jobs by the job seekers
@app.route('/api/applyJob',methods = ["POST"])
@jwt_required_custom
def candidate_apply_job():
    return apply_job()


if __name__ == '__main__':
    app.run(
        host="0.0.0.0", 
        port=int(   os.environ.get("PORT", 5000)),
        # port = 5000,
        debug=True
    )

    