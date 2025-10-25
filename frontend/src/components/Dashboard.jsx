// frontend/src/components/Dashboard.jsx

import React, { useEffect } from 'react';
import PortfolioCard from './PortfolioCard'; // Assuming PortfolioCard.jsx is in the same directory

const Dashboard = () => {
  // Simple auth check (expand with redirect in v2)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token, redirect to login would go here');
      // Add redirect logic (e.g., useNavigate from react-router if using)
    }
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-white p-4 rounded shadow">
        <PortfolioCard />
      </div>
      <div className="bg-white p-4 rounded shadow">Big Players (Placeholder)</div>
      <div className="bg-white p-4 rounded shadow">Market Trends (Placeholder)</div>
      <div className="bg-white p-4 rounded shadow">Opportunities (Placeholder)</div>
    </div>
  );
};

export default Dashboard;