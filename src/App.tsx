
import { Suspense, lazy } from 'react';
import { Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import LiveChat from './components/chat/LiveChat';

const App = () => {
  return (
    <>
      <Routes />
      <Toaster position="top-right" richColors />
      <LiveChat />
    </>
  );
};

export default App;
