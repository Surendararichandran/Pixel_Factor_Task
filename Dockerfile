# Use slim Python base image
FROM python:3.11-slim

# Set environment variables to reduce Python output buffering and bytecode
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y build-essential

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project
COPY . .

# Expose Flask/Gunicorn port
EXPOSE 5000

# Run app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
