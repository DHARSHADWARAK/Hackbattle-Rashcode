const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const { getLatestStockPrice } = require('../utils/stockData');
const { isAuthenticated } = require('../middlewares/authMiddleware');

/**
 * GET /stocks/profitloss/:email
 * For a given user email, fetch each stock's current price and calculate profit/loss.
 */
router.get('/profitloss/:email', isAuthenticated, async (req, res) => {
  try {
    const userEmailParam = req.params.email;
    console.log('[DEBUG] GET /stocks/profitloss for user:', userEmailParam);

    // Ensure the logged-in user's email matches the parameter
    if (req.user.email !== userEmailParam) {
      console.log('[DEBUG] Unauthorized access attempt');
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Fetch all stocks for this user
    const userStocks = await Stock.find({ userEmail: userEmailParam });
    if (!userStocks.length) {
      console.log('[DEBUG] No stocks found for this user');
      return res.status(404).json({ message: 'No stocks found for this user' });
    }

    // Process each stock to fetch real-time price and calculate profit/loss
    const results = await Promise.all(
      userStocks.map(async (stock) => {
        try {
          const { price: currentPrice, date: latestDate } = await getLatestStockPrice(stock.symbol);

          // Calculate profit: (currentPrice - buyPrice) * quantity
          const profit = (currentPrice - stock.buyPrice) * stock.quantity;
          // Calculate currentValue: currentPrice * quantity
          const currentValue = currentPrice * stock.quantity;

          return {
            symbol: stock.symbol,
            quantity: stock.quantity,
            buyPrice: stock.buyPrice,
            currentDayPrice: currentPrice,
            priceDate: latestDate,
            profit: profit,
            currentValue: currentValue,
          };
        } catch (err) {
          console.error(`[DEBUG] Error fetching price for ${stock.symbol}:`, err.message);
          return {
            symbol: stock.symbol,
            quantity: stock.quantity,
            buyPrice: stock.buyPrice,
            error: 'Could not fetch stock price',
          };
        }
      })
    );

    // Return enriched data
    res.json({ user: userEmailParam, stocks: results });
  } catch (error) {
    console.error('[DEBUG] Error calculating profit/loss:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
