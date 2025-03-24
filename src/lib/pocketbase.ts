import PocketBase from 'pocketbase';

const pb = new PocketBase('http://10.10.0.90:8090');

// 🔐 garder la session si elle existe
pb.authStore.loadFromCookie(document.cookie);

export default pb;

