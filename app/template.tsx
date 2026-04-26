'use client';

import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
