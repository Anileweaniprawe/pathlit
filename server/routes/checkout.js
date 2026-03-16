const express = require('express');
const router = express.Router();

const stripe = process.env.STRIPE_SECRET_KEY
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;

const { saveOrder } = require('../services/storage');

// POST /api/create-checkout-session
router.post('/create-checkout-session', async (req, res) => {
    try {
        const { email, quizId } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        // If Stripe is not configured, return demo session
        if (!stripe) {
            console.log('[checkout] Stripe not configured — returning demo session');
            const orderId = saveOrder({
                email,
                quizId: quizId || null,
                stripeSessionId: 'demo_' + Date.now(),
                amount: 999
            });
            return res.json({
                demo: true,
                orderId,
                message: 'Stripe not configured. Set STRIPE_SECRET_KEY in .env to enable real payments.'
            });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Pathlit Clarity Pro Report',
                        description: '15-page personalised career blueprint with 3 career paths, strengths deep-dive, values map, and 30-day action plan.',
                        images: ['https://pathlit.app/og-image.png']
                    },
                    unit_amount: 999 // $9.99 in cents
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.BASE_URL || 'http://localhost:3000'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/clarity-pro.html`,
            metadata: {
                quizId: quizId || ''
            }
        });

        // Save order
        saveOrder({
            email,
            quizId: quizId || null,
            stripeSessionId: session.id,
            amount: 999
        });

        console.log(`[checkout] Session created: ${session.id} for ${email}`);
        res.json({ sessionId: session.id });

    } catch (err) {
        console.error('[checkout] Error:', err.message);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

module.exports = router;
