require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhook');
const quizRoutes = require('./routes/quiz');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
//  MIDDLEWARE ORDER IS CRITICAL
//  Stripe webhooks need raw body for signature
//  verification — must come BEFORE express.json()
// =============================================

// 1. Webhook route (needs raw body)
app.use('/api/webhook', webhookRoutes);

// 2. Standard middleware
app.use(cors());
app.use(express.json());

// 3. Static files — serve the frontend
app.use(express.static(path.join(__dirname, '..')));

// 4. API routes
app.use('/api', checkoutRoutes);
app.use('/api', quizRoutes);

// 5. SPA fallback — serve index.html for unmatched routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`\n  🔥 Pathlit server running at http://localhost:${PORT}\n`);
    console.log(`  📝 Quiz API:     POST /api/quiz-results`);
    console.log(`  💳 Checkout:     POST /api/create-checkout-session`);
    console.log(`  🔔 Webhook:      POST /api/webhook\n`);
});
