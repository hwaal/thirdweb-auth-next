// reset.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const ResetPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Function to clear visited and card-used data from localStorage
    const clearVisitedAndCardUsedData = () => {
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('visited-') || key.startsWith('card-used-')) {
            localStorage.removeItem(key);
          }
        });
      }
    };

    clearVisitedAndCardUsedData();
    router.push('/'); // Redirect to home page after clearing data
  }, [router]);

  // You can show a loading or a message here if you want
  return <div>Resetting data...</div>;
};

export default ResetPage;
