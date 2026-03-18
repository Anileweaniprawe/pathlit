const stripe = process.env.STRIPE_SECRET_KEY
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { email, quizId } = req.body;

        if (!email || !email.includes('@')) {
            return res.status(400).json({ error: 'Valid email is required' });
        }

        if (!stripe) {
            return res.status(500).json({ error: 'Stripe not configured' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    unit_amount: 999,
                    product_data: {
                        name: 'Pathlit Clarity Pro Report',
                        description: '15-page personalised career blueprint with 3 career paths, strengths deep-dive, values map, and 30-day action plan.',
                    },
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: `${process.env.BASE_URL || 'https://pathlit-cyan.vercel.app'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL || 'https://pathlit-cyan.vercel.app'}/clarity-pro.html`,
            metadata: { quizId: quizId || '' }
        });

        console.log(`[checkout] Session created: ${session.id} for ${email}`);
        res.json({ sessionId: session.id, url: session.url });

    } catch (err) {
        console.error('[checkout] Error:', err.message);
        res.status(500).json({ error: 'Failed to create checkout session', details: err.message });
    }
};
