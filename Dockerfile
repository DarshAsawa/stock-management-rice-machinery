FROM python:3.10

WORKDIR /app

# Install MySQL client tools
RUN apt-get update && apt-get install -y default-mysql-client && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Make wait script executable
RUN chmod +x wait-for-db.sh

CMD ["flask", "run", "--host=0.0.0.0"]
