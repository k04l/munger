// backend/routes/portfolio.js

const express = require('express');
const router = express.Router();
const yahooFinance = require('yahoo-finance2').default;
const { pool } = require('../db'); // Import pool from db.js
const { verifyToken } = require('../auth');

// GET /portfolio - Fetch user's portfolio with current prices
router.get('/', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT stocks FROM portfolios WHERE user_id = $1', [req.user.id]);
    let stocks = rows.length > 0 ? rows[0].stocks : [];

    // Enrich with current prices using Promise.all for better performance
    const updatedStocks = await Promise.all(
      stocks.map(async (stock) => {
        try {
          const quote = await yahooFinance.quote(stock.ticker);
          return { ...stock, currentPrice: quote.regularMarketPrice || null };
        } catch (err) {
          console.error(`Price fetch failed for ${stock.ticker}:`, err);
          return { ...stock, currentPrice: null };
        }
      })
    );

    res.json({ stocks: updatedStocks });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /portfolio - Add stock to portfolio
router.post('/', verifyToken, async (req, res) => {
  const { ticker, quantity, buyPrice } = req.body;
  if (!ticker || !quantity || !buyPrice) {
    return res.status(400).json({ msg: 'Missing fields' });
  }

  try {
    const { rows } = await pool.query('SELECT stocks FROM portfolios WHERE user_id = $1', [req.user.id]);
    let stocks = rows.length > 0 ? rows[0].stocks : [];

    // Add new stock with parsed values
    stocks.push({
      ticker: ticker.toUpperCase(),
      quantity: parseFloat(quantity),
      buyPrice: parseFloat(buyPrice)
    });

    const query = rows.length > 0
      ? pool.query('UPDATE portfolios SET stocks = $1 WHERE user_id = $2', [JSON.stringify(stocks), req.user.id])
      : pool.query('INSERT INTO portfolios (user_id, stocks) VALUES ($1, $2)', [req.user.id, JSON.stringify(stocks)]);

    await query;
    res.status(201).json({ msg: 'Stock added', stocks });
  } catch (err) {
    console.error('Database or processing error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;