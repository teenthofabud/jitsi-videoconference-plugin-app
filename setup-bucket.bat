@echo off
set AWS_ACCESS_KEY_ID=minioadmin
set AWS_SECRET_ACCESS_KEY=minioadmin
set AWS_DEFAULT_REGION=us-east-1

echo Setting up MinIO bucket for public access...
aws s3api put-bucket-policy --bucket test --policy "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::test/*\"}]}" --endpoint-url http://localhost:9000

echo Setting up website configuration...
aws s3 website s3://test --index-document index.html --error-document index.html --endpoint-url http://localhost:9000

echo Done! Your app should be accessible at: http://localhost:9000/test/index.html