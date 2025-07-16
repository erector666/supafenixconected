import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing environment variables:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Found' : 'Missing');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Found' : 'Missing');

// Show all environment variables that start with VITE_
const viteVars = Object.keys(process.env).filter(key => key.startsWith('VITE_'));
console.log('All VITE_ variables:', viteVars); 