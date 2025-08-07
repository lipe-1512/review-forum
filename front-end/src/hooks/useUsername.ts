import { useState, useEffect } from 'react';

const USERNAME_KEY = 'username';

export const useUsername = () => {
  const [username, setUsername] = useState<string>('var3');

  useEffect(() => {
    // Lê o username do sessionStorage
    const storedUsername = sessionStorage.getItem(USERNAME_KEY);
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return { username };
}; 