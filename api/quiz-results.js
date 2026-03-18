// Serverless function — quiz results stored in-memory (use a DB for production)
// For now: returns 200 and stores nothing (stateless Vercel functions can't persist to disk)
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
        const { scores, archetype, answers } = req.body || {};
        if (!scores || !archetype) {
            return res.status(400).json({ error: 'scores and archetype are required' });
        }
        const id = `quiz_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        console.log(`[quiz] Result ${id} — archetype: ${archetype}`);
        return res.json({ id, archetype });
    }

    res.status(405).json({ error: 'Method not allowed' });
};
