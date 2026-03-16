// ========================================
//  PDF Report Generation (Stub)
// ========================================
//
//  This module is a placeholder for the Clarity Pro PDF report.
//  To implement:
//    1. npm install puppeteer  (or pdfkit, or jspdf)
//    2. Create an HTML template with the user's archetype, scores, career paths
//    3. Render to PDF
//    4. Send via email (nodemailer, sendgrid, etc.)
//

async function generateReport({ quizResult, email }) {
    console.log(`[report] Generating Clarity Pro report for ${email}`);
    console.log(`[report] Archetype: ${quizResult.archetype}`);
    console.log(`[report] Scores:`, quizResult.scores);

    // TODO: Generate actual PDF
    // const pdf = await renderPDF(quizResult);
    // await sendEmail(email, pdf);

    return {
        status: 'stub',
        message: 'PDF generation not yet implemented. See server/services/report.js'
    };
}

async function sendReportEmail({ email, pdfBuffer }) {
    console.log(`[report] Sending report email to ${email}`);
    // TODO: Implement with nodemailer or SendGrid
    // const transporter = nodemailer.createTransport({ ... });
    // await transporter.sendMail({ ... });
    return { sent: false, message: 'Email sending not yet implemented' };
}

module.exports = {
    generateReport,
    sendReportEmail
};
