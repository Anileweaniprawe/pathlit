const stripe = process.env.STRIPE_SECRET_KEY
    ? require('stripe')(process.env.STRIPE_SECRET_KEY)
    : null;

// Vercel needs raw body for Stripe webhook signature verification
export const config = { api: { bodyParser: false } };

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).end();

    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
        console.log('[webhook] Stripe not configured — ignoring');
        return res.status(200).json({ received: true });
    }

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks);

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            rawBody,
            req.headers['stripe-signature'],
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('[webhook] Signature failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[webhook] Event: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log(`[webhook] Payment completed: ${session.customer_email}`);
        // TODO: mark quiz as paid, send report email
    }

    res.status(200).json({ received: true });
};
