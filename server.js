const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'issues.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize data file
async function initDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
}

// Get all issues
app.get('/api/issues', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to read issues' });
    }
});

// Add new issue
app.post('/api/issues', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const issues = JSON.parse(data);
        
        const newIssue = {
            ...req.body,
            id: Date.now(),
            createdAt: new Date().toISOString()
        };
        
        issues.push(newIssue);
        await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2));
        
        res.json(newIssue);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save issue' });
    }
});

// Update issue
app.put('/api/issues/:id', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const issues = JSON.parse(data);
        
        const index = issues.findIndex(i => i.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Issue not found' });
        }
        
        issues[index] = { ...issues[index], ...req.body };
        await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2));
        
        res.json(issues[index]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update issue' });
    }
});

// Delete issue
app.delete('/api/issues/:id', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        let issues = JSON.parse(data);
        
        issues = issues.filter(i => i.id !== parseInt(req.params.id));
        await fs.writeFile(DATA_FILE, JSON.stringify(issues, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete issue' });
    }
});

initDataFile().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Local: http://localhost:${PORT}`);
    });
});
