@echo off
set AWS_ACCESS_KEY_ID=minioadmin
set AWS_SECRET_ACCESS_KEY=minioadmin
set AWS_DEFAULT_REGION=us-east-1

aws s3 sync dist/launch-pad/browser s3://test --endpoint-url http://localhost:9000 --delete