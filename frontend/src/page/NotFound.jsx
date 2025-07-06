import React from 'react';
import { useNavigate } from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f5f5f5] text-[#252422] px-4">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-6 text-lg text-center">Oops! We couldn’t find that page.</p>
      <button
        onClick={() => navigate('/')}
        className="bg-[#403D39] text-[#FFFCF2] px-4 py-2 rounded-lg"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFound;