import fs from 'fs';

const envContent = `VITE_SUPABASE_URL=https://lykhurrywtvzffbcbkdp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5a2h1cnJ5d3R2emZmYmNia2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MTgwNzQsImV4cCI6MjA2NzM5NDA3NH0.1EpibWKtEVYAJuDHBnRO53oHK-ytTdQSWQPYeGe52-g
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAuDjIik681kmwRz56jEQULsxmTif_tFHI
`;

fs.writeFileSync('.env', envContent);
console.log('.env file created successfully!'); 