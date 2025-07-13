#!/bin/bash

echo "Waiting for MySQL database to be ready..."

# Wait for MySQL to be ready
while ! mysqladmin ping -h db -u stockuser -pstockpass --silent; do
    echo "MySQL is not ready yet. Waiting..."
    sleep 2
done

echo "MySQL is ready! Starting Flask application..."

# Start Flask application
exec flask run --host=0.0.0.0 