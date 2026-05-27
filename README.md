## Floci.io local testing
Since the base href property set by Angular by default will be having the value '/', 
that is to resolve any paths based on the root domain, js, css files etc will not be loaded
properly when locally testing using floci.io, But this will be needed when hosted on real
aws s3

So for local testing, follow below steps :

1. export ```BASE_REF``` env varaible with the s3 static website's bucket name as value
2. run the ```npm run local-build``` for build


## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd launch-pad
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Navigate to `http://localhost:4200/` to view the application.

## 🏗️ Build

```bash
npm run build
```

Build artifacts are stored in the `dist/launch-pad/` directory.

## 🚀 Deployment

### Automated Deployment

#### Node.js Deployment Script
```bash
# Deploy with default settings (MinIO localhost)
npm run deploy

# Deploy to AWS S3
npm run deploy:aws

# Build and deploy in one command
npm run build-and-deploy

# Deploy to custom bucket/endpoint
node deploy.js --bucket my-bucket --endpoint https://s3.amazonaws.com

# Deploy without deleting remote files
node deploy.js --no-delete

# Show help
node deploy.js --help
```

The deployment script supports:
- Custom S3 endpoints (MinIO, DigitalOcean Spaces, etc.)
- Automatic content-type detection
- Sync with delete (removes files not present locally)
- Default MinIO credentials for local development

### Manual S3/MinIO Bucket Setup

For environments using S3 or MinIO for static hosting, you'll need to configure bucket policies and website hosting. The exact steps vary by environment:

#### MinIO Local Development
1. Set up AWS CLI with MinIO credentials:
   ```bash
   export AWS_ACCESS_KEY_ID=minioadmin
   export AWS_SECRET_ACCESS_KEY=minioadmin
   export AWS_DEFAULT_REGION=us-east-1
   ```

2. Configure bucket policy for public access:
   ```bash
   aws s3api put-bucket-policy --bucket test --policy '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":"*","Action":"s3:GetObject","Resource":"arn:aws:s3:::test/*"}]}' --endpoint-url http://localhost:9000
   ```

3. Set up static website hosting manually in MinIO Console at http://localhost:9001

4. Your app will be accessible at: http://localhost:9000/test/index.html

#### AWS S3 Production
- Configure bucket policy for public read access
- Enable static website hosting
- Set index.html as the index document
- Configure CloudFront distribution (recommended)

#### Other S3-Compatible Services
- Adapt the above commands for your specific endpoint and credentials
- Consult your provider's documentation for static website hosting setup


## 🧪 Testing

Run unit tests:
```bash
npm test
```

## 🔧 Development

### Adding Components
```bash
ng generate component component-name
```

### Customizing Themes
Modify the theme configuration in `app.module.ts`:
```typescript
const BluePreset = definePreset(Aura, {
  semantic: {
    primary: {
      // Your color values
    }
  }
});
```

## 📝 License

MIT License
