import fs from 'fs';

// Read the current .env file
const envContent = fs.readFileSync('.env', 'utf8');

// Add the service role key
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2h1cnJ5d3R2emZmYmNia2RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTcxOTcxOSwiZXhwIjoyMDUxMjk1NzE5fQ.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q';

const updatedEnvContent = envContent + `\nSUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}`;

// Write back to .env file
fs.writeFileSync('.env', updatedEnvContent);
console.log('Service role key added to .env file successfully!'); 