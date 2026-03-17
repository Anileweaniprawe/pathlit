const express = require('express');
const router = express.Router();

const { updateOrderStatus, getOrderBySession } = require('../services/storage');
const { markQuizPaid, getQuizResult, setQuizEmail, saveReportBuffer } = require('../services/storage');
const { generateReport } = require('../services/report');

// IMPORTANT: This route uses express.raw() for Stripe signature verification.
// It's mounted BEFORE express.json() in server/index.js
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const stripe = process.env.STRIPE_SECRET_KEY
        ? require('stripe')(process.env.STRIPE_SECRET_KEY)
        : null;

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret) {
        console.log('[webhook] Stripe not configured — ignoring webhook');
        return res.status(200).json({ received: true });
    }

    const sig = req.headers['stripe-signature'];

    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('[webhook] Signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`[webhook] Received event: ${event.type}`);

    // Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const email = session.customer_email;
        const quizId = session.metadata?.quizId;

        console.log(`[webhook] Payment completed for ${email}, quiz: ${quizId}`);

        // Update order status
        updateOrderStatus(session.id, 'completed');

        // Mark quiz as paid and generate report
        if (quizId) {
            markQuizPaid(quizId);
            setQuizEmail(quizId, email);

            const quizResult = getQuizResult(quizId);
            if (quizResult) {
                try {
                    console.log(`[webhook] Generating PDF report for ${email}...`);
                    const report = await generateReport({ quizResult, email });

                    // Cache the PDF buffer for download
                    if (report.pdfBuffer) {
                        saveReportBuffer(quizId, report.pdfBuffer);
                        console.log(`[webhook] PDF cached (${report.pdfBuffer.length} bytes, ${report.pageCount} pages)`);
                    }

                    // TODO: Send email with PDF attachment via SendGrid
                    // await sendReportEmail({ email, pdfBuffer: report.pdfBuffer });

                } catch (err) {
                    console.error('[webhook] Report generation failed:', err.message);
                }
            }
        }
    }

    res.status(200).json({ received: true });
});

module.exports = router;
