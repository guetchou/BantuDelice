
import PocketBase from 'pocketbase';

// Create a single PocketBase instance for the entire app
const pb = new PocketBase('https://your-pocketbase-url.com');

export default pb;
