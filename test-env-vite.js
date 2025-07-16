console.log('Testing Vite environment variables:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Found' : 'Missing');
console.log('VITE_GOOGLE_MAPS_API_KEY:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

// Show all VITE_ variables
const viteVars = Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'));
console.log('All VITE_ variables:', viteVars); 