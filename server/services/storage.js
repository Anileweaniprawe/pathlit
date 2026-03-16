const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_DIR = path.join(__dirname, '..', 'data');
const QUIZ_FILE = path.join(DATA_DIR, 'quiz-results.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

// Ensure data directory and files exist
function ensureFiles() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(QUIZ_FILE)) {
        fs.writeFileSync(QUIZ_FILE, '{}');
    }
    if (!fs.existsSync(ORDERS_FILE)) {
        fs.writeFileSync(ORDERS_FILE, '{}');
    }
}

ensureFiles();

function readJSON(filepath) {
    try {
        return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    } catch {
        return {};
    }
}

function writeJSON(filepath, data) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// ========== Quiz Results ==========

function saveQuizResult({ scores, archetype, answers }) {
    const id = uuidv4();
    const data = readJSON(QUIZ_FILE);
    data[id] = {
        id,
        scores,
        archetype,
        answers,
        createdAt: new Date().toISOString(),
        paid: false
    };
    writeJSON(QUIZ_FILE, data);
    return id;
}

function getQuizResult(id) {
    const data = readJSON(QUIZ_FILE);
    return data[id] || null;
}

function markQuizPaid(quizId) {
    const data = readJSON(QUIZ_FILE);
    if (data[quizId]) {
        data[quizId].paid = true;
        data[quizId].paidAt = new Date().toISOString();
        writeJSON(QUIZ_FILE, data);
        return true;
    }
    return false;
}

// ========== Orders ==========

function saveOrder({ email, quizId, stripeSessionId, amount }) {
    const id = uuidv4();
    const data = readJSON(ORDERS_FILE);
    data[id] = {
        id,
        email,
        quizId,
        stripeSessionId,
        amount,
        status: 'pending',
        createdAt: new Date().toISOString()
    };
    writeJSON(ORDERS_FILE, data);
    return id;
}

function updateOrderStatus(stripeSessionId, status) {
    const data = readJSON(ORDERS_FILE);
    const order = Object.values(data).find(o => o.stripeSessionId === stripeSessionId);
    if (order) {
        data[order.id].status = status;
        data[order.id].updatedAt = new Date().toISOString();
        writeJSON(ORDERS_FILE, data);
        return order;
    }
    return null;
}

function getOrderBySession(stripeSessionId) {
    const data = readJSON(ORDERS_FILE);
    return Object.values(data).find(o => o.stripeSessionId === stripeSessionId) || null;
}

module.exports = {
    saveQuizResult,
    getQuizResult,
    markQuizPaid,
    saveOrder,
    updateOrderStatus,
    getOrderBySession
};
