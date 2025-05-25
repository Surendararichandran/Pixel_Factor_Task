# dockerFile
FROM  ubuntu:latest

RUN  apt update -y &&  apt-get update -y  &&   apt-get install -y python3 python3-pip 

RUN pip install flask ==3.8*

COPY requirement.txt .

RUN pip install -r requirement.txt

COPY . .



EXPOSE 5000

CMD ["gunicorn","app:app"] 