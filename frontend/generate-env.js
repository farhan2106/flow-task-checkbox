const fs = require('fs');

// Generate .env.development file with all environment variables
const envContent = Object.keys(process.env)
  .filter(key => key.includes('NODE_ENV') || key.includes('FE_')) // Exclude NODE_ENV
  .map(key => `${key}=${process.env[key]}`)
  .join('\n');

fs.writeFileSync('.env', envContent);
