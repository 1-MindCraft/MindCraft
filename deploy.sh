#!/bin/bash
set -e

cd /home/ssm-user/MindCraft
mkdir -p nginx back-end ai

aws s3 cp s3://mindcraft-deploy/docker-compose.yml .
aws s3 cp s3://mindcraft-deploy/nginx.conf ./nginx/nginx.conf

command -v jq || sudo dnf install -y jq

> back-end/.env
> ai/.env

aws ssm get-parameters-by-path \
  --path "/mindcraft/prod" \
  --with-decryption \
  --region ap-northeast-2 \
  --query "Parameters[*].[Name,Value]" \
  --output text | while IFS=$'\t' read -r name value; do
    key=$(basename "$name")
    if [ "$key" = "OPENAI_API_KEY" ]; then
      echo "$key=$value" >> ai/.env
    else
      echo "$key=$value" >> back-end/.env
    fi
done

DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id "rds!db-a078a9de-4369-45dc-a206-dd95d18fd56d-4hjP3o" \
  --region ap-northeast-2 \
  --query "SecretString" \
  --output text | jq -r '.password')

echo "DB_PASSWORD=$DB_PASSWORD" >> back-end/.env

docker compose pull
docker compose down
docker compose up -d