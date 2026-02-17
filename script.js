/**
 * CONFIGURATION
 * Replace the URL below with your Google Apps Script Web App URL.
 * Ensure the script is deployed as a Web App with "Anyone" access.
 */
const API_URL = 'https://script.google.com/macros/s/AKfycbzzM4FGr-WKUee2N45-8404io2RMs7USkAfuo7N2hNwvZ6tA0EBNgPayNGGwK8r1da1/exec'; 

// DOM Elements
const dataTable = document.getElementById('dataTable');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const emptyState = document.getElementById('emptyState');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const statusIndicator = document.getElementById('statusIndicator');
const lastUpdatedEl = document.getElementById('lastUpdated');

let rawData = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

// Refresh Button Listener
refreshBtn.addEventListener('click', () => {
    const icon = refreshBtn.querySelector('i');
    icon.classList.add('fa-spin');
    fetchData();
});

// Search Listener
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    
    if (rawData.length <= 1) return; // No data or just headers

    const headers = rawData[0];
    const bodyRows = rawData.slice(1);
    
    const filtered = bodyRows.filter(row => {
        return row.some(cell => String(cell).toLowerCase().includes(term));
    });
    
    renderTable(filtered, headers);
});

/**
 * Fetch Data from Google Sheets API
 */
async function fetchData() {
    // UI Updates
    showLoading(true);
    updateStatus('Connecting...', 'warning');
    hideError();

    try {
        // Validation check for placeholder URL
        if (API_URL.includes('REPLACE_WITH_YOUR')) {
            throw new Error('Placeholder URL detected. Please update script.js with your actual API URL.');
        }

        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Data Validation
        if (!Array.isArray(data) || data.length === 0) {
            showEmpty(true);
            updateStatus('No Data', 'warning');
            rawData = [];
            return;
        }

        rawData = data; // Store for search
        renderTable(data.slice(1), data[0]); // Render all body rows, pass headers
        
        // Success UI
        updateStatus('Live', 'success');
        updateLastUpdated();
        showEmpty(false);

    } catch (error) {
        console.error('Fetch Error:', error);
        showError(true);
        updateStatus('Connection Failed', 'error');
        
        if (error.message.includes('Placeholder URL')) {
             // Optional: visual cue for the user
             console.warn("Please configure your API_URL in script.js");
        }
    } finally {
        showLoading(false);
        const icon = refreshBtn.querySelector('i');
        if(icon) icon.classList.remove('fa-spin');
    }
}

/**
 * Render Data to Table
 * @param {Array} rows - Array of data rows (excluding header)
 * @param {Array} headers - Array of header strings
 */
function renderTable(rows, headers) {
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Render Headers
    if (headers && headers.length > 0) {
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            tableHead.appendChild(th);
        });
    }

    if (!rows || rows.length === 0) {
        // Show "No results" inside table if search is empty but headers exist
        const colSpan = headers ? headers.length : 1;
        tableBody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No matching records found</td></tr>`;
        return;
    }

    // Render Body
    rows.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            // Format dates if needed, or check types. For now, simple text.
            td.textContent = cell;
            tableBody.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

// --- Helper Functions ---

function showLoading(isLoading) {
    if (isLoading) {
        loadingState.classList.remove('hidden');
        if(dataTable) dataTable.style.opacity = '0.3';
    } else {
        loadingState.classList.add('hidden');
        if(dataTable) dataTable.style.opacity = '1';
    }
}

function showError(isError) {
    if (isError) {
        errorState.classList.remove('hidden');
        if(dataTable) dataTable.classList.add('hidden');
    } else {
        errorState.classList.add('hidden');
        if(dataTable) dataTable.classList.remove('hidden');
    }
}

function showEmpty(isEmpty) {
    if (isEmpty) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

function updateStatus(text, type) {
    const dot = statusIndicator.querySelector('.dot');
    const label = statusIndicator.querySelector('.text');
    
    statusIndicator.className = 'status-indicator'; // reset
    if (type === 'success') statusIndicator.classList.add('connected');
    if (type === 'warning') statusIndicator.classList.add('connected'); // Use same color or different? Let's stick to CSS logic. 
    // Wait, CSS has .connected (green) and .error (red). Default is yellow.
    if (type === 'error') statusIndicator.classList.add('error');
    
    if(label) label.textContent = text;
}

function updateLastUpdated() {
    const now = new Date();
    lastUpdatedEl.textContent = `Last updated: ${now.toLocaleTimeString()}`;
}

function hideError() {
    errorState.classList.add('hidden');
}
