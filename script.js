// Initialize
const API_URL = '/api/issues';
let issues = [];
let editingId = null;
const SUPERVISOR_PASSWORD = 'supervisor123'; // Change this password

// Interpreter authentication
function authenticateInterpreter() {
    const selectedName = document.getElementById('interpreter-name').value;
    const interpreterId = document.getElementById('interpreter-id').value;
    
    if (!selectedName || !interpreterId) {
        alert('Please select your name first');
        return false;
    }
    
    // Check if already authenticated in this session
    const savedAuth = sessionStorage.getItem('interpreterAuth');
    if (savedAuth === selectedName) {
        return true;
    }
    
    // Generate expected password: FirstnameID (e.g., Filmon20280)
    const firstName = selectedName.split(' ')[0];
    const expectedPassword = firstName + interpreterId;
    
    const enteredPassword = prompt('Enter your password to submit:');
    
    if (enteredPassword === expectedPassword) {
        sessionStorage.setItem('interpreterAuth', selectedName);
        return true;
    } else {
        alert('Incorrect password! If you forgot your password, please contact your supervisor.');
        return false;
    }
}

// Interpreter list - will be populated from data
const interpreters = [
    { name: "Filmon Bezabh", id: "20280", language: "Amharic" },
    { name: "Sumyat Noe", id: "19034", language: "Burmese" },
    { name: "Talha Idress", id: "19029", language: "Punjabi" },
    { name: "ahtsham Ahmed", id: "19036", language: "Pashto" },
    { name: "Nahili Midekso", id: "20466", language: "Amharic" },
    { name: "Faress Eissa", id: "19078", language: "Arabic" },
    { name: "Noelia Mariel Castro", id: "19164", language: "Spanish" },
    { name: "Rawan Mohamed", id: "20107", language: "Arabic" },
    { name: "Nicolas Martinez", id: "19163", language: "Spanish" },
    { name: "Ahmed Elsayed", id: "20609", language: "Arabic" },
    { name: "Eloy Andrade", id: "19191", language: "Spanish" },
    { name: "Anas Saeed", id: "20791", language: "Arabic" },
    { name: "Ignacio Monje", id: "19848", language: "Spanish" },
    { name: "Wilson Perez", id: "19915", language: "Spanish" },
    { name: "Oishik Rahman", id: "20449", language: "Bengali" },
    { name: "Youssef Alnemr", id: "20108", language: "Arabic" },
    { name: "Herard Francisca", id: "20465", language: "French" },
    { name: "Roha Ahmed", id: "20284", language: "Arabic" },
    { name: "Jesula Francillon", id: "20608", language: "Haitian Creole" },
    { name: "Maxcein Louhis", id: "20683", language: "Haitian Creole" },
    { name: "Claudy Saintilme", id: "20543", language: "Haitian Creole" },
    { name: "Carolina Laurido", id: "20313", language: "Spanish" },
    { name: "Khadija Quraishi", id: "20311", language: "Pashto" },
    { name: "Hira Jann", id: "20344", language: "Pashto" },
    { name: "Leena Mohammadzai", id: "20436", language: "Pashto" },
    { name: "Dave Marc-Onel", id: "20435", language: "Haitian Creole" },
    { name: "Riazullah Safi", id: "20611", language: "Pashto" },
    { name: "Dharshna Soundararajan", id: "20430", language: "Tamil" },
    { name: "Joao Horta", id: "20541", language: "Portuguese" },
    { name: "Omar Elsakhawy", id: "20468", language: "Arabic" },
    { name: "Carlos Junior", id: "20794", language: "Portuguese" },
    { name: "Rahimyar Sahibzada", id: "20282", language: "Punjabi" },
    { name: "Miguel Lopez", id: "20464", language: "Spanish" },
    { name: "Rizwan Ayub", id: "20283", language: "Punjabi" },
    { name: "Hamza Khan", id: "20448", language: "Punjabi" },
    { name: "Silfaude Jerome", id: "20559", language: "Haitian Creole" },
    { name: "Shyngis Kanapin", id: "21701", language: "Russian" },
    { name: "Mohamed Amin", id: "20385", language: "Somali" },
    { name: "Martin Biritos", id: "19080", language: "Spanish" },
    { name: "Kamran Mohammadi", id: "20610", language: "Dari" },
    { name: "Muhammad Sajjad", id: "20684", language: "Hindi" },
    { name: "PATRICK AQUINO", id: "20685", language: "Tagalog" },
    { name: "Mariam Castillo", id: "20682", language: "Spanish" },
    { name: "Paula Romero", id: "19580", language: "Spanish" },
    { name: "Youssef Yasser", id: "20680", language: "German" },
    { name: "Boris Gatwaza", id: "20716", language: "French" },
    { name: "Jesús Daniel Rhenals Pinto", id: "20792", language: "Spanish" },
    { name: "Erwan Rumata", id: "20793", language: "Kinyarwanda" },
    { name: "Javier Andres Molina", id: "20798", language: "Spanish" },
    { name: "Karen Sigilwig", id: "20855", language: "Spanish" },
    { name: "Mariana Belen Jofre", id: "20797", language: "Spanish" },
    { name: "Madina Torakai", id: "20796", language: "Dari" },
    { name: "Kervent Sanon", id: "20795", language: "French" },
    { name: "Santiago Caicedo", id: "21941", language: "Spanish" },
    { name: "Carmen Macias", id: "20837", language: "Spanish" },
    { name: "Mohamed abdikadir", id: "20838", language: "Swahili" },
    { name: "Gustavo Henriquez", id: "20462", language: "Spanish" },
    { name: "Aya Haji", id: "20903", language: "Oromo" },
    { name: "Jesema Yasmin", id: "20904", language: "Tamil" },
    { name: "Niaz Ahmed", id: "20901", language: "Hindi" },
    { name: "Carmenza Gomez", id: "21342", language: "Spanish" },
    { name: "Milenko Carlessi", id: "19241", language: "Spanish" },
    { name: "Jose Baisi", id: "21817", language: "Spanish" },
    { name: "Sebastian Bulnes", id: "19035", language: "Spanish" },
    { name: "Ana Montalvo", id: "21958", language: "Spanish" },
    { name: "Maria Amaya", id: "22315", language: "Spanish" },
    { name: "Sergio Rivas", id: "22314", language: "Spanish" },
    { name: "Maria Valencia", id: "22313", language: "Spanish" },
    { name: "Rosalia Flores", id: "22316", language: "Spanish" },
    { name: "Jose Gonzalez", id: "22340", language: "Spanish" },
    { name: "Derian Orozco", id: "22407", language: "Spanish" },
    { name: "Heyoan Gonzalez", id: "22409", language: "Spanish" },
    { name: "Emanuel Noguera", id: "22415", language: "Spanish" },
    { name: "Valentina Tamayo", id: "22422", language: "Spanish" },
    { name: "Hussein Samy", id: "22470", language: "Arabic" },
    { name: "Rosalia Farfan", id: "22410", language: "Spanish" },
    { name: "Viviana Peinado", id: "22411", language: "Spanish" },
    { name: "Josue Osorio", id: "18042", language: "Spanish" },
    { name: "Edmilson Pungi", id: "22537", language: "Portuguese" },
    { name: "Ronald Pac", id: "22552", language: "Spanish" },
    { name: "Adriana Alejandra Martinez Gutierrez", id: "22561", language: "Spanish" },
    { name: "Maximo Demarco", id: "22581", language: "Spanish" },
    { name: "Jade Menezes Brito", id: "19366", language: "Portuguese" },
    { name: "Lomje Patricia Fajardo Martinez", id: "22589", language: "Spanish" },
    { name: "Stephannya Mora", id: "22590", language: "Spanish" },
    { name: "Patricia Joi Gonzaga Valdez", id: "22594", language: "Tagalog" },
    { name: "Francis Indo Rivera", id: "22632", language: "Spanish" },
    { name: "Gustavo Andres Acosta Romero", id: "22628", language: "Spanish" },
    { name: "Edier Giraldo Arengas", id: "22647", language: "Spanish" },
    { name: "Edson Antonio Calvo Valdez", id: "22661", language: "Spanish" },
    { name: "Deana Kruseman", id: "22675", language: "Spanish" },
    { name: "Ahmed Magdy Abdelhamed Mohamed", id: "22676", language: "Arabic" },
    { name: "Camila Aimee Ruiz Inzunza", id: "22726", language: "Spanish" },
    { name: "Mohamed Hamam Ahmed Mostafa", id: "22783", language: "Arabic" },
    { name: "Rashida Risso Tomes", id: "22797", language: "Spanish" },
    { name: "Andrea Coca", id: "21308", language: "Spanish" },
    { name: "Miguel Angel Perez Mendez", id: "22820", language: "Spanish" },
    { name: "Samuel Sanchez Herrera", id: "22819", language: "Spanish" },
    { name: "Jose Leonardo Juarez Meza", id: "22818", language: "Spanish" },
    { name: "Felipe Vargas", id: "22817", language: "Spanish" },
    { name: "Jhonatan Orjuela Barrios", id: "22829", language: "Spanish" },
    { name: "Constanza Coll", id: "22845", language: "Spanish" },
    { name: "Agustin Alexander Castillo Valladares", id: "22846", language: "Spanish" },
    { name: "Nyree Aguilar Soto", id: "22862", language: "Spanish" },
    { name: "Sergio Zavala Morles", id: "16721", language: "Spanish" },
    { name: "Jorge Chan Moreno", id: "22863", language: "Spanish" },
    { name: "Luis Alfonso Sanchez Ordonez", id: "22864", language: "Spanish" },
    { name: "Bryant Steven Ramírez Sandoval", id: "21584", language: "Spanish" },
    { name: "Fabian Alejandro Sanchez Blanco", id: "22877", language: "Spanish" },
    { name: "Héctor García Chávez", id: "22893", language: "Spanish" },
    { name: "Rahi Arlenn Javier Mendoza Melo", id: "22911", language: "Spanish" },
    { name: "Tatiana Tais Capria", id: "19162", language: "Spanish" },
    { name: "Erika Paola Aguayza Castro", id: "22919", language: "Spanish" },
    { name: "Juan Arana", id: "13175", language: "Spanish" },
    { name: "Eliecer Daniel Colina Andrade", id: "22941", language: "Spanish" },
    { name: "Jahaziel García Hernández", id: "22953", language: "Spanish" },
    { name: "Ana Marcela Hernández Cabellos", id: "22954", language: "Spanish" },
    { name: "Cesar Alarcon Serrano", id: "22961", language: "Spanish" },
    { name: "Gustavo Adolfo Ramirez Azahar", id: "23064", language: "Spanish" }
];

// Load issues from server
async function loadIssues() {
    try {
        const response = await fetch(API_URL);
        issues = await response.json();
        updateIssueCount();
        renderIssues();
    } catch (error) {
        console.error('Failed to load issues:', error);
    }
}

// Save issues (not needed with API)
function saveIssues() {
    // No longer needed - API handles saving
}

// Update issue count display
function updateIssueCount() {
    const countEl = document.getElementById('issue-count');
    if (countEl) {
        let count = issues.length;
        
        // If not supervisor, only count their own issues
        if (!isSupervisorMode) {
            const myName = localStorage.getItem('myInterpreterName');
            if (myName) {
                count = issues.filter(i => i.interpreterName === myName).length;
            }
        }
        
        countEl.textContent = `${count} issue(s) reported`;
    }
}

// Populate interpreter dropdown
function populateInterpreters() {
    const select = document.getElementById('interpreter-name');
    const savedName = localStorage.getItem('myInterpreterName');
    
    interpreters.forEach(interpreter => {
        const option = document.createElement('option');
        option.value = interpreter.name;
        option.dataset.id = interpreter.id;
        option.dataset.language = interpreter.language;
        option.textContent = `${interpreter.name} (${interpreter.id})`;
        select.appendChild(option);
    });
    
    // Pre-select saved interpreter name
    if (savedName) {
        select.value = savedName;
        const selectedOption = select.selectedOptions[0];
        if (selectedOption) {
            document.getElementById('interpreter-id').value = selectedOption.dataset.id;
            document.getElementById('interpreter-language').value = selectedOption.dataset.language;
        }
    }
}

// Update interpreter ID and language when name is selected
document.getElementById('interpreter-name').addEventListener('change', (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const interpreterId = selectedOption?.dataset.id || '';
    const language = selectedOption?.dataset.language || '';
    const interpreterName = e.target.value;
    
    document.getElementById('interpreter-id').value = interpreterId;
    document.getElementById('interpreter-language').value = language;
    
    // Remember this interpreter's name for filtering their own issues
    if (interpreterName) {
        localStorage.setItem('myInterpreterName', interpreterName);
    }
});

// Supervisor mode
let isSupervisorMode = sessionStorage.getItem('supervisorMode') === 'true';

function enableSupervisorMode() {
    const password = prompt('Enter supervisor password:');
    if (password === SUPERVISOR_PASSWORD) {
        isSupervisorMode = true;
        sessionStorage.setItem('supervisorMode', 'true');
        document.getElementById('supervisor-mode-btn').textContent = 'Supervisor Mode: ON';
        document.getElementById('supervisor-mode-btn').style.background = '#4CAF50';
        alert('Supervisor mode enabled! You can now see all issues and edit/delete them.');
        loadIssues(); // Reload to show all issues
    } else {
        alert('Incorrect password!');
    }
}

document.getElementById('supervisor-mode-btn').addEventListener('click', () => {
    if (!isSupervisorMode) {
        enableSupervisorMode();
    }
});

// Check if already in supervisor mode
if (isSupervisorMode) {
    document.getElementById('supervisor-mode-btn').textContent = 'Supervisor Mode: ON';
    document.getElementById('supervisor-mode-btn').style.background = '#4CAF50';
}

// Load issues on page load
populateInterpreters();
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

// Show resolution date field when status is resolved (supervisor only)
document.getElementById('status').addEventListener('change', (e) => {
    const resolutionDateGroup = document.getElementById('resolution-date-group');
    if (e.target.value === 'resolved') {
        resolutionDateGroup.style.display = 'block';
        // Auto-fill current date/time in PST if empty
        const resolutionDateInput = document.getElementById('resolution-date');
        if (!resolutionDateInput.value) {
            setPSTDateTime('resolution-date');
        }
    } else {
        resolutionDateGroup.style.display = 'none';
    }
});

// Form submission
document.getElementById('issue-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Authenticate interpreter if not in supervisor mode
    if (!isSupervisorMode && !editingId) {
        if (!authenticateInterpreter()) {
            return; // Stop submission if authentication fails
        }
    }
    
    const issueType = document.getElementById('issue-type').value;
    const interpreterName = document.getElementById('interpreter-name').value;
    const startDate = document.getElementById('start-date').value;
    const attachmentUrl = document.getElementById('attachment-url').value;
    const status = document.getElementById('status').value;
    const resolutionDate = document.getElementById('resolution-date').value;
    
    const interpreterId = document.getElementById('interpreter-id').value;
    const interpreterLanguage = document.getElementById('interpreter-language').value;
    
    const issue = {
        issueType,
        interpreterName,
        interpreterId,
        interpreterLanguage,
        startDate,
        attachmentUrl,
        status,
        resolutionDate: resolutionDate || null
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
        let response;
        if (editingId) {
            response = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(issue)
            });
            editingId = null;
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(issue)
            });
        }
        
        if (!response.ok) {
            throw new Error('Failed to save');
        }
        
        e.target.reset();
        document.getElementById('missed-call-fields').style.display = 'none';
        document.getElementById('account-issue-fields').style.display = 'none';
        document.getElementById('resolution-date-group').style.display = 'none';
        
        // Reset status dropdown for non-supervisors
        if (!isSupervisorMode) {
            document.getElementById('status').disabled = true;
            document.getElementById('status').value = 'open';
            document.querySelectorAll('#status option').forEach((opt, idx) => {
                if (idx > 0) opt.style.display = 'none';
            });
        }
        
        await loadIssues();
        alert(`Issue saved successfully!`);
    } catch (error) {
        console.error('Failed to save issue:', error);
        alert('Failed to save issue. Please try again.');
    }
});

// Render issues
function renderIssues() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const filterType = document.getElementById('filter-type').value;
    const filterStatus = document.getElementById('filter-status').value;
    const filterDate = document.getElementById('filter-date').value;
    
    let filtered = issues.filter(issue => {
        const matchesSearch = issue.interpreterName.toLowerCase().includes(searchTerm) ||
                            (issue.callId && issue.callId.toLowerCase().includes(searchTerm));
        const matchesType = !filterType || issue.issueType === filterType;
        const matchesStatus = !filterStatus || issue.status === filterStatus;
        
        // Filter by date (compare only the date part, not time)
        let matchesDate = true;
        if (filterDate) {
            const issueDate = issue.startDate ? issue.startDate.split('T')[0] : '';
            matchesDate = issueDate === filterDate;
        }
        
        // If not supervisor mode, only show issues for the selected interpreter
        let matchesInterpreter = true;
        if (!isSupervisorMode) {
            const myName = localStorage.getItem('myInterpreterName');
            matchesInterpreter = myName ? issue.interpreterName === myName : true;
        }
        
        return matchesSearch && matchesType && matchesStatus && matchesDate && matchesInterpreter;
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
                ${issue.interpreterId ? `<div class="issue-detail"><strong>ID:</strong> ${issue.interpreterId}</div>` : ''}
                ${issue.interpreterLanguage ? `<div class="issue-detail"><strong>Language:</strong> ${issue.interpreterLanguage}</div>` : ''}
                ${issue.callId ? `<div class="issue-detail"><strong>Call ID:</strong> ${issue.callId}</div>` : ''}
                ${issue.accountStatus ? `<div class="issue-detail"><strong>Status:</strong> ${issue.accountStatus}</div>` : ''}
                ${issue.missedCallsCount ? `<div class="issue-detail"><strong>Missed Calls:</strong> ${issue.missedCallsCount}</div>` : ''}
                <div class="issue-detail"><strong>Start:</strong> ${formatDate(issue.startDate)}</div>
                ${issue.resolutionDate ? `<div class="issue-detail"><strong>Resolved:</strong> ${formatDate(issue.resolutionDate)}</div>` : ''}
                ${issue.attachmentUrl ? `<div class="issue-detail"><strong>Attachment:</strong> <a href="${issue.attachmentUrl}" target="_blank" style="color: #2196F3;">View File</a></div>` : ''}
            </div>
            ${issue.reason ? `<div class="issue-detail"><strong>Reason:</strong> ${issue.reason}</div>` : ''}
            ${issue.notes ? `<div class="issue-detail"><strong>Notes:</strong> ${issue.notes}</div>` : ''}
            ${isSupervisorMode ? `
            <div class="issue-actions">
                <button class="btn-small btn-edit" onclick="editIssue(${issue.id})">Edit</button>
                <button class="btn-small btn-delete" onclick="deleteIssue(${issue.id})">Delete</button>
            </div>
            ` : ''}
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
    if (!isSupervisorMode) {
        alert('Only supervisors can edit issues.');
        return;
    }
    
    const issue = issues.find(i => i.id === id);
    if (!issue) return;
    
    editingId = id;
    
    // Enable status dropdown for supervisor
    document.getElementById('status').disabled = false;
    document.querySelectorAll('#status option').forEach(opt => opt.style.display = 'block');
    
    document.getElementById('issue-type').value = issue.issueType;
    document.getElementById('issue-type').dispatchEvent(new Event('change'));
    document.getElementById('interpreter-name').value = issue.interpreterName;
    document.getElementById('interpreter-id').value = issue.interpreterId || '';
    document.getElementById('interpreter-language').value = issue.interpreterLanguage || '';
    document.getElementById('start-date').value = issue.startDate;
    document.getElementById('attachment-url').value = issue.attachmentUrl || '';
    document.getElementById('status').value = issue.status;
    document.getElementById('status').dispatchEvent(new Event('change')); // Trigger resolution date visibility
    document.getElementById('resolution-date').value = issue.resolutionDate || '';
    
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
    if (!isSupervisorMode) {
        alert('Only supervisors can delete issues.');
        return;
    }
    
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
document.getElementById('filter-date').addEventListener('change', renderIssues);
document.getElementById('search').addEventListener('input', renderIssues);
document.getElementById('filter-type').addEventListener('change', renderIssues);
document.getElementById('filter-status').addEventListener('change', renderIssues);

// Export to CSV
document.getElementById('export-btn').addEventListener('click', () => {
    if (issues.length === 0) {
        alert('No issues to export');
        return;
    }
    
    const headers = ['ID', 'Type', 'Interpreter', 'Interpreter ID', 'Language', 'Call ID', 'Account Status', 'Missed Calls', 'Reason/Notes', 'Start Date', 'Attachment URL', 'Status'];
    const rows = issues.map(issue => [
        issue.id,
        formatIssueType(issue.issueType),
        issue.interpreterName,
        issue.interpreterId || '',
        issue.interpreterLanguage || '',
        issue.callId || '',
        issue.accountStatus || '',
        issue.missedCallsCount || '',
        issue.reason || issue.notes || '',
        issue.startDate,
        issue.attachmentUrl || '',
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

// Set default start date to now in PST
function setPSTDateTime(inputId) {
    const input = document.getElementById(inputId);
    const now = new Date();
    
    // Convert to PST (UTC-8)
    const pstOffset = -8 * 60; // PST is UTC-8
    const localOffset = now.getTimezoneOffset(); // User's timezone offset
    const pstTime = new Date(now.getTime() + (localOffset + pstOffset) * 60000);
    
    // Format for datetime-local input
    const year = pstTime.getFullYear();
    const month = String(pstTime.getMonth() + 1).padStart(2, '0');
    const day = String(pstTime.getDate()).padStart(2, '0');
    const hours = String(pstTime.getHours()).padStart(2, '0');
    const minutes = String(pstTime.getMinutes()).padStart(2, '0');
    
    input.value = `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Set default start date to now in PST
setPSTDateTime('start-date');
