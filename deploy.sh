#!/bin/bash
set -euo pipefail

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

docker compose pull
docker compose down
docker compose up -d