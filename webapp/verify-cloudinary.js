/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');

console.log('=== Cloudinary Configuration Verification ===\n');
console.log('1. Checking .env file...');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('   ERROR: .env file not found at', envPath);
  process.exit(1);
}

try {
  require('dotenv').config();
  console.log('   [OK] .env file loaded successfully');
} catch (error) {
  console.error('   ERROR: Failed to load .env file:', error.message);
  process.exit(1);
}

console.log('\n2. Checking required environment variables...');
const requiredVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
let missingVars = [];

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`   [OK] ${varName} is set`);
  } else {
    console.log(`   [MISSING] ${varName} is NOT set`);
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error(`\n   ERROR: Missing environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

console.log('\n3. Attempting to import cloudinary package...');
try {
  const cloudinary = require('cloudinary');
  console.log('   [OK] Cloudinary package imported successfully');
} catch (error) {
  console.error('   ERROR: Failed to import cloudinary package:', error.message);
  process.exit(1);
}

console.log('\n=== SUCCESS ===');
console.log('All Cloudinary configuration checks passed!');
console.log('- All required environment variables are set');
console.log('- Cloudinary package is available');
