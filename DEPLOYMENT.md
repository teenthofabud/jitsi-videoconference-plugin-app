# MinIO Deployment Setup

## What's Working ✅
- **AWS CLI** for deployment to MinIO
- **MinIO** as S3-compatible storage
- **Files uploading successfully** to bucket

## Prerequisites
1. ✅ MinIO server running on `http://localhost:9000`
2. ✅ AWS CLI installed
3. ✅ Bucket named `test` created in MinIO

## Quick Deployment Commands

### Deploy to MinIO
```bash
npm run deploy:minio
```

### Build and Deploy (one command)
```bash
npm run build-and-deploy
```

### Setup MinIO bucket for web hosting
```bash
npm run setup-minio
```

## How it Works
- Uses **AWS CLI** with MinIO's S3-compatible API
- Syncs `dist/launch-pad/browser` to MinIO bucket
- No additional packages needed (removed ngx-aws-deploy)

## Manual AWS CLI Command
```bash
aws s3 sync dist/launch-pad/browser s3://test --endpoint-url http://localhost:9000 --delete
```

## Environment (automatically set by scripts)
- `AWS_ACCESS_KEY_ID=minioadmin`
- `AWS_SECRET_ACCESS_KEY=minioadmin`
- `AWS_DEFAULT_REGION=us-east-1`

## Next Steps for Web Access
Run `npm run setup-minio` to configure static website hosting, then access at:
`http://localhost:9000/test/index.html`