
import { useState, useEffect } from 'react';

export const useNowHour = () => {
  const [nowHour, setNowHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => setNowHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  return nowHour;
};
