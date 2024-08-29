#!/bin/sh

until npx prisma migrate deploy; do
    echo "Postgres is unavailable - sleeping"
    sleep 2
done

npm start
