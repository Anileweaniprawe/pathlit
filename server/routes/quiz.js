const express = require('express');
const router = express.Router();
const { saveQuizResult, getQuizResult, getReportBuffer } = require('../services/storage');
const { generateReport } = require('../services/report');

// POST /api/quiz-results — save quiz scores after completion
router.post('/quiz-results', (req, res) => {
    try {
        const { scores, archetype, answers } = req.body;

        if (!scores || !archetype) {
            return res.status(400).json({ error: 'scores and archetype are required' });
        }

        const id = saveQuizResult({ scores, archetype, answers: answers || [] });
        console.log(`[quiz] Saved result ${id} — archetype: ${archetype}`);

        res.json({ id, archetype });
    } catch (err) {
        console.error('[quiz] Error:', err.message);
        res.status(500).json({ error: 'Failed to save quiz results' });
    }
});

// GET /api/quiz-results/:id — retrieve a specific quiz result
router.get('/quiz-results/:id', (req, res) => {
    try {
        const result = getQuizResult(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Quiz result not found' });
        }

        // If not paid, only return basic info (archetype, strengths)
        if (!result.paid) {
            return res.json({
                id: result.id,
                archetype: result.archetype,
                paid: false
            });
        }

        // Paid users get full result
        res.json(result);
    } catch (err) {
        console.error('[quiz] Error:', err.message);
        res.status(500).json({ error: 'Failed to retrieve quiz results' });
    }
});

// GET /api/report/:id — download PDF report (paid users only)
router.get('/report/:id', async (req, res) => {
    try {
        const result = getQuizResult(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Quiz result not found' });
        }

        if (!result.paid) {
            return res.status(403).json({ error: 'Report not purchased. Complete payment first.' });
        }

        // Check if we already have a cached PDF
        let pdfBuffer = getReportBuffer(req.params.id);

        if (!pdfBuffer) {
            // Generate fresh PDF
            const report = await generateReport({
                quizResult: result,
                email: result.email || 'Pathlit User'
            });
            pdfBuffer = report.pdfBuffer;
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Pathlit-Clarity-Pro-Report.pdf"`);
        res.send(pdfBuffer);

    } catch (err) {
        console.error('[report] Download error:', err.message);
        res.status(500).json({ error: 'Failed to generate report' });
    }
});

module.exports = router;
