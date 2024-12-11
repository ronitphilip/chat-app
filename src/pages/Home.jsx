import React, { useState, useEffect } from 'react';
import SplashScreen from './SplashScreen';
import Auth from './Auth';

const Home = () => {
  
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Auth/>
      )}
    </>
  )
}

export default Home