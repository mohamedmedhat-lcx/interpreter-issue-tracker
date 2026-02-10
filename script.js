// Initialize
const API_URL = '/api/issues';
let issues = [];
let editingId = null;

// Load issues from server
async function loadIssues() {
    try {
        const response = await fetch(API_URL);
        issues = await response.json();
        renderIssues();
    } catch (error) {
        console.error('Failed to load issues:', error);
        alert('Failed to load issues from server');
    }
}

// Load issues on page load
loadIssues();

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        if (tabName === 'view') {
            renderIssues();
        }
    });
});

// Show/hide conditional fields
document.getElementById('issue-type').addEventListener('change', (e) => {
    const missedCallFields = document.getElementById('missed-call-fields');
    const accountIssueFields = document.getElementById('account-issue-fields');
    
    missedCallFields.style.display = 'none';
    accountIssueFields.style.display = 'none';
    
    if (e.target.value === 'missed-call') {
        missedCallFields.style.display = 'block';
    } else if (e.target.value === 'account-issue') {
        accountIssueFields.style.display = 'block';
    }
});

// Form submission
document.getElementById('issue-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const issueType = document.getElementById('issue-type').value;
    const interpreterName = document.getElementById('interpreter-name').value;
    const startDate = document.getElementById('start-date').value;
    const resolutionDate = document.getElementById('resolution-date').value;
    const status = document.getElementById('status').value;
    
    const issue = {
        issueType,
        interpreterName,
        startDate,
        resolutionDate,
        status
    };
    
    if (issueType === 'missed-call') {
        issue.callId = document.getElementById('call-id').value;
        issue.reason = document.getElementById('reason').value;
    } else if (issueType === 'account-issue') {
        issue.accountStatus = document.getElementById('account-status').value;
        issue.missedCallsCount = document.getElementById('missed-calls-count').value;
        issue.notes = document.getElementById('account-notes').value;
    }
    
    try {
        if (editingId) {
            await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(issue)
            });
            editingId = null;
        } else {
            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(issue)
            });
        }
        
        e.target.reset();
        document.getElementById('missed-call-fields').style.display = 'none';
        document.getElementById('account-issue-fields').style.display = 'none';
        
        alert('Issue saved successfully!');
        await loadIssues();
    } catch (error) {
        console.error('Failed to save issue:', error);
        alert('Failed to save issue');
    }
});

// Render issues
function renderIssues() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filterType = document.getElementById('filter-type').value;
    const filterStatus = document.getElementById('filter-status').value;
    
    let filtered = issues.filter(issue => {
        const matchesSearch = issue.interpreterName.toLowerCase().includes(searchTerm) ||
                            (issue.callId && issue.callId.toLowerCase().includes(searchTerm));
        const matchesType = !filterType || issue.issueType === filterType;
        const matchesStatus = !filterStatus || issue.status === filterStatus;
        
        return matchesSearch && matchesType && matchesStatus;
    });
    
    const issuesList = document.getElementById('issues-list');
    
    if (filtered.length === 0) {
        issuesList.innerHTML = '<div class="empty-state">No issues found</div>';
        return;
    }
    
    issuesList.innerHTML = filtered.map(issue => `
        <div class="issue-card">
            <div class="issue-header">
                <span class="issue-type ${issue.issueType}">${formatIssueType(issue.issueType)}</span>
                <span class="issue-status ${issue.status}">${formatStatus(issue.status)}</span>
            </div>
            <div class="issue-details">
                <div class="issue-detail"><strong>Interpreter:</strong> ${issue.interpreterName}</div>
                ${issue.callId ? `<div class="issue-detail"><strong>Call ID:</strong> ${issue.callId}</div>` : ''}
                ${issue.accountStatus ? `<div class="issue-detail"><strong>Status:</strong> ${issue.accountStatus}</div>` : ''}
                ${issue.missedCallsCount ? `<div class="issue-detail"><strong>Missed Calls:</strong> ${issue.missedCallsCount}</div>` : ''}
                <div class="issue-detail"><strong>Start:</strong> ${formatDate(issue.startDate)}</div>
                ${issue.resolutionDate ? `<div class="issue-detail"><strong>Resolved:</strong> ${formatDate(issue.resolutionDate)}</div>` : ''}
            </div>
            ${issue.reason ? `<div class="issue-detail"><strong>Reason:</strong> ${issue.reason}</div>` : ''}
            ${issue.notes ? `<div class="issue-detail"><strong>Notes:</strong> ${issue.notes}</div>` : ''}
            <div class="issue-actions">
                <button class="btn-small btn-edit" onclick="editIssue(${issue.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteIssue(${issue.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function formatIssueType(type) {
    return type === 'missed-call' ? 'Missed Call' : 'Account Issue';
}

function formatStatus(status) {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
}

function editIssue(id) {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;
    
    editingId = id;
    
    document.getElementById('issue-type').value = issue.issueType;
    document.getElementById('issue-type').dispatchEvent(new Event('change'));
    document.getElementById('interpreter-name').value = issue.interpreterName;
    document.getElementById('start-date').value = issue.startDate;
    document.getElementById('resolution-date').value = issue.resolutionDate || '';
    document.getElementById('status').value = issue.status;
    
    if (issue.issueType === 'missed-call') {
        document.getElementById('call-id').value = issue.callId || '';
        document.getElementById('reason').value = issue.reason || '';
    } else if (issue.issueType === 'account-issue') {
        document.getElementById('account-status').value = issue.accountStatus || '';
        document.getElementById('missed-calls-count').value = issue.missedCallsCount || '';
        document.getElementById('account-notes').value = issue.notes || '';
    }
    
    document.querySelector('[data-tab="report"]').click();
    window.scrollTo(0, 0);
}

async function deleteIssue(id) {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        await loadIssues();
    } catch (error) {
        console.error('Failed to delete issue:', error);
        alert('Failed to delete issue');
    }
}

// Filters
document.getElementById('search').addEventListener('input', renderIssues);
document.getElementById('filter-type').addEventListener('change', renderIssues);
document.getElementById('filter-status').addEventListener('change', renderIssues);

// Export to CSV
document.getElementById('export-btn').addEventListener('click', () => {
    if (issues.length === 0) {
        alert('No issues to export');
        return;
    }
    
    const headers = ['ID', 'Type', 'Interpreter', 'Call ID', 'Account Status', 'Missed Calls', 'Reason/Notes', 'Start Date', 'Resolution Date', 'Status'];
    const rows = issues.map(issue => [
        issue.id,
        formatIssueType(issue.issueType),
        issue.interpreterName,
        issue.callId || '',
        issue.accountStatus || '',
        issue.missedCallsCount || '',
        issue.reason || issue.notes || '',
        issue.startDate,
        issue.resolutionDate || '',
        formatStatus(issue.status)
    ]);
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interpreter-issues-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

// Set default start date to now
document.getElementById('start-date').value = new Date().toISOString().slice(0, 16);
