// frontend/src/components/PortfolioCard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'; // For charts

const PortfolioCard = () => {
  const [stocks, setStocks] = useState([]);
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const token = localStorage.getItem('token'); // From Step 2 login

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('http://localhost:5000/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStocks(res.data.stocks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addStock = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/portfolio', { ticker, quantity, buyPrice }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPortfolio(); // Refresh
      setTicker(''); setQuantity(''); setBuyPrice('');
    } catch (err) {
      console.error(err);
    }
  };

  // Dummy chart data per stock (replace with real historical in Step 5)
  const getChartData = (stock) => [
    { date: 'Day1', price: stock.buyPrice },
    { date: 'Now', price: stock.currentPrice || stock.buyPrice }
  ];

  return (
    <div className="bg-white p-4 rounded shadow w-full">
      <h2 className="text-xl font-bold mb-4">My Portfolio</h2>
      
      {/* Add Form */}
      <form onSubmit={addStock} className="mb-6 flex flex-col sm:flex-row gap-2">
        <input type="text" placeholder="Ticker (e.g., AAPL)" value={ticker} onChange={(e) => setTicker(e.target.value)} className="p-2 border rounded" required />
        <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="p-2 border rounded" required />
        <input type="number" placeholder="Buy Price" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="p-2 border rounded" required />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Stock</button>
      </form>
      
      {/* Display List */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Ticker</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Buy $</th>
              <th className="p-2">Current $</th>
              <th className="p-2">P&L</th>
              <th className="p-2">Chart</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, idx) => {
              const pnl = stock.currentPrice ? (stock.currentPrice - stock.buyPrice) * stock.quantity : 0;
              return (
                <tr key={idx} className="border-b">
                  <td className="p-2">{stock.ticker}</td>
                  <td className="p-2">{stock.quantity}</td>
                  <td className="p-2">${stock.buyPrice.toFixed(2)}</td>
                  <td className="p-2">${stock.currentPrice ? stock.currentPrice.toFixed(2) : 'N/A'}</td>
                  <td className="p-2 ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}"}>${pnl.toFixed(2)}</td>
                  <td className="p-2">
                    <ResponsiveContainer width={100} height={50}>
                      <LineChart data={getChartData(stock)}>
                        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip />
                      </LineChart>
                    </ResponsiveContainer>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PortfolioCard;