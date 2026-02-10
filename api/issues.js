const fs = require('fs').promises;
const path = require('path');

// Use /tmp directory for Vercel serverless functions
const DATA_FILE = '/tmp/issues.json';

// Initialize data file
async function initDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    await initDataFile();

    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        let issues = JSON.parse(data);

        if (req.method === 'GET') {
            // Get all issues
            res.status(200).json(issues);
        } else if (req.method === 'POST') {
            // Add new issue
            const newIssue = {
                ...req.body,
                id: Date.now(),
                createdAt: new Date().toISOString()
            };
            issues.push(newIssue);
            await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2));
            res.status(200).json(newIssue);
        } else if (req.method === 'PUT') {
            // Update issue
            const id = parseInt(req.url.split('/').pop());
            const index = issues.findIndex(i => i.id === id);
            if (index === -1) {
                res.status(404).json({ error: 'Issue not found' });
                return;
            }
            issues[index] = { ...issues[index], ...req.body };
            await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2));
            res.status(200).json(issues[index]);
        } else if (req.method === 'DELETE') {
            // Delete issue
            const id = parseInt(req.url.split('/').pop());
            issues = issues.filter(i => i.id !== id);
            await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2));
            res.status(200).json({ success: true });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
