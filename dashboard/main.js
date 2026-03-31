import { marked } from 'marked';

// --- CONFIGURATION ---
const BUS_URL = '/workspace/gag_bus.json';
const MEMORY_DIR = '/workspace/memory/';
const LOG_URL = '/workspace/memory/logs/night_watch.log';
const BILLING_URL = '/workspace/memory/billing/billing_2026-03-26.json';
const POLL_INTERVAL = 5000;
const DAILY_BUDGET = 5.00; // $5 USD Max Gauge

// --- DOM ELEMENTS ---
const busList = document.getElementById('bus-list');
const morningReportContent = document.getElementById('morning-report-content');
const logTerminal = document.getElementById('log-terminal');
const creditSpentEl = document.getElementById('credit-spent');
const gaugeFill = document.getElementById('gauge-fill');
const cmdInput = document.getElementById('cmd-input');
const btnDispatch = document.getElementById('btn-dispatch');

// --- DASHBOARD LOGIC ---

async function fetchTelemetry() {
    // 1. Fetch Neural Bus
    try {
        const response = await fetch(BUS_URL);
        const data = await response.json();
        renderBus(data);
    } catch (err) {
        busList.innerHTML = `<div style="color: #ff4d4d;">Neural Bus Sync Offline</div>`;
    }

    // 2. Fetch Billing / Credit Gauge
    try {
        const response = await fetch(BILLING_URL);
        const data = await response.json();
        updateCreditGauge(data);
    } catch (err) {
        console.warn('Billing sync fail');
    }

    // 3. Fetch Logs (Mercury Terminal)
    try {
        const response = await fetch(LOG_URL);
        const text = await response.text();
        const lines = text.split('\n').slice(-15).join('<br>');
        logTerminal.innerHTML = lines || 'No active terminal output detected.';
        logTerminal.scrollTop = logTerminal.scrollHeight;
    } catch (err) {
        logTerminal.innerHTML = 'Establishing log uplink...';
    }
}

async function fetchLatestReport() {
    try {
        const reportName = encodeURIComponent('MORNING_REPORT_#5_26-03-26.md');
        const response = await fetch(`${MEMORY_DIR}${reportName}`);
        const mdText = await response.text();
        morningReportContent.innerHTML = marked.parse(mdText);
    } catch (err) {
        morningReportContent.innerHTML = `<p>Establishing link to Morning Reports...</p>`;
    }
}

// --- UTILITIES ---

function renderBus(data) {
    const tasks = data.telegram_to_jarvis || [];
    if (tasks.length === 0) {
        busList.innerHTML = `<div style="color: var(--text-dim);">No active tasks in queue.</div>`;
        return;
    }
    busList.innerHTML = tasks.slice().reverse().map(task => `
        <div class="bus-item">
            <div class="label">Task from ${task.sender || 'Dashboard'}</div>
            <div class="value">${task.task}</div>
            <div style="font-size: 0.7rem; color: ${task.status === 'completed' ? '#00ff88' : '#ffcc00'}; margin-top: 5px;">
                Status: ${task.status.toUpperCase()}
            </div>
        </div>
    `).join('');
}

function updateCreditGauge(data) {
    const totalCost = data.total_cost || 0;
    creditSpentEl.innerText = `$${totalCost.toFixed(2)}`;
    
    // SVG Circumference for r=60 is 2 * PI * 60 = 377
    const circumference = 377;
    const progress = Math.min(totalCost / DAILY_BUDGET, 1);
    const offset = circumference * (1 - progress);
    gaugeFill.setAttribute('stroke-dasharray', `${circumference - offset} ${circumference}`);
}

async function dispatchTask() {
    const task = cmdInput.value.trim();
    if (!task) return;

    btnDispatch.innerText = 'WAIT...';
    btnDispatch.disabled = true;

    try {
        const res = await fetch('/api/write-bus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, sender: 'Web-UI' })
        });
        
        if (res.ok) {
            cmdInput.value = '';
            fetchTelemetry(); // Instant refresh
        }
    } catch (err) {
        alert('Dispatch Failure: Check Server Console.');
    } finally {
        btnDispatch.innerText = 'SEND';
        btnDispatch.disabled = false;
    }
}

// --- INITIALIZATION ---

function init() {
    console.log('Antigravity Dashboard v2.0 Armed.');
    
    fetchTelemetry();
    fetchLatestReport();
    
    setInterval(fetchTelemetry, POLL_INTERVAL);
    
    btnDispatch.addEventListener('click', dispatchTask);
    cmdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') dispatchTask();
    });
}

document.addEventListener('DOMContentLoaded', init);
