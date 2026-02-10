// Simple in-memory storage for now (will reset on redeploy)
// For production, connect to MongoDB or another database
let issues = [];

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
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
            res.status(200).json(newIssue);
        } else if (req.method === 'PUT') {
            // Update issue - get ID from query parameter
            const url = new URL(req.url, `http://${req.headers.host}`);
            const pathParts = url.pathname.split('/');
            const id = parseInt(pathParts[pathParts.length - 1]);
            
            console.log('PUT request - ID:', id, 'URL:', req.url);
            
            const index = issues.findIndex(i => i.id === id);
            if (index === -1) {
                console.log('Issue not found, available IDs:', issues.map(i => i.id));
                res.status(404).json({ error: 'Issue not found', requestedId: id, availableIds: issues.map(i => i.id) });
                return;
            }
            issues[index] = { ...issues[index], ...req.body, id: issues[index].id };
            res.status(200).json(issues[index]);
        } else if (req.method === 'DELETE') {
            // Delete issue
            const urlParts = req.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 1]);
            issues = issues.filter(i => i.id !== id);
            res.status(200).json({ success: true });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message });
    }
}
