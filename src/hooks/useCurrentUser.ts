import { useEffect, useState } from 'react';
import pb from '../lib/pocketbase';

export default function useCurrentUser() {
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setUser(pb.authStore.model);
    });
    return unsubscribe;
  }, []);

  return user;
}
