#!/usr/bin/env node

const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Parse command line arguments
const args = process.argv.slice(2);
const config = {
  bucket: 'test',
  localPath: 'dist/launch-pad/browser',
  endpoint: null,
  delete: true
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--bucket') config.bucket = args[++i];
  else if (args[i] === '--path') config.localPath = args[++i];
  else if (args[i] === '--endpoint') config.endpoint = args[++i];
  else if (args[i] === '--no-delete') config.delete = false;
  else if (args[i] === '--help') {
    console.log('Usage: node deploy.js [--bucket name] [--path dir] [--endpoint url] [--no-delete]');
    process.exit(0);
  }
}

// Set default MinIO credentials
process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || 'minioadmin';
process.env.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || 'minioadmin';
process.env.AWS_DEFAULT_REGION = process.env.AWS_DEFAULT_REGION || 'us-east-1';

// Create S3 client
const s3ClientConfig = {
  region: process.env.AWS_DEFAULT_REGION || 'us-east-1'
};

if (config.endpoint) {
  s3ClientConfig.endpoint = config.endpoint;
  s3ClientConfig.forcePathStyle = true;
}

const s3 = new S3Client(s3ClientConfig);

async function getAllFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath, baseDir));
    } else {
      const s3Key = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      files.push({ localPath: fullPath, s3Key });
    }
  }
  return files;
}

async function deploy() {
  console.log(`Deploying ${config.localPath} to ${config.bucket}...`);

  // Get existing files for deletion
  const existingKeys = new Set();
  if (config.delete) {
    try {
      const list = await s3.send(new ListObjectsV2Command({ Bucket: config.bucket }));
      list.Contents?.forEach(obj => existingKeys.add(obj.Key));
    } catch (e) { /* ignore */ }
  }

  // Upload all files
  const files = await getAllFiles(config.localPath);
  const uploadedKeys = new Set();

  for (const file of files) {
    try {
      await s3.send(new PutObjectCommand({
        Bucket: config.bucket,
        Key: file.s3Key,
        Body: fs.readFileSync(file.localPath),
        ContentType: mime.lookup(file.localPath) || 'application/octet-stream'
      }));
      console.log(`Uploaded: ${file.s3Key}`);
      uploadedKeys.add(file.s3Key);
    } catch (error) {
      console.error(`Error uploading ${file.s3Key}: ${error.message}`);
    }
  }

  // Delete removed files
  if (config.delete) {
    const toDelete = [...existingKeys].filter(key => !uploadedKeys.has(key));
    if (toDelete.length > 0) {
      try {
        await s3.send(new DeleteObjectsCommand({
          Bucket: config.bucket,
          Delete: { Objects: toDelete.map(Key => ({ Key })) }
        }));
        toDelete.forEach(key => console.log(`Deleted: ${key}`));
      } catch (e) { /* ignore */ }
    }
  }

  console.log(`\nDeployed ${uploadedKeys.size} files to ${config.bucket}`);
  if (config.endpoint) {
    console.log(`App: ${config.endpoint}/${config.bucket}/index.html`);
  }
}

deploy().catch(console.error);