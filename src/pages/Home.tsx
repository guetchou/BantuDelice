
import React from 'react';
import Index from './Index';

// This component exists to provide compatibility with the routing system
// It simply wraps the Index component for now, but will allow us to make
// more substantial changes in the future without breaking routing
const Home: React.FC = () => {
  return <Index />;
};

export default Home;
