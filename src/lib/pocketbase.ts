
import PocketBase from 'pocketbase';

// Create a single PocketBase instance for the entire app
const pb = new PocketBase('https://your-pocketbase-url.com');

// Add a helper method to check if the user is authenticated
export const isAuthenticated = () => pb.authStore.isValid;

// Export the PocketBase client
export default pb;
