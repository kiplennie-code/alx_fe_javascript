// Default quotes data
const defaultQuotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Innovation", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "Perseverance", author: "Aristotle" },
    { text: "The only impossible journey is the one you never begin.", category: "Motivation", author: "Tony Robbins" },
    { text: "Success is not final, failure is not fatal.", category: "Success", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", category: "Motivation", author: "Theodore Roosevelt" }
];

const STORAGE_KEY = 'quotes_data';
let quotes = [];

// Initialize the application
function init() {
    loadQuotesFromStorage();
    
    if (quotes.length === 0) {
        quotes = JSON.parse(JSON.stringify(defaultQuotes));
        saveQuotesToStorage();
    }
    
    setupEventListeners();
    populateCategoryFilter();
    displayRandomQuote();
    displaySavedQuotes();
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('newQuote').addEventListener('click', displayRandomQuote);
    document.getElementById('addQuote').addEventListener('click', addQuote);
    document.getElementById('exportData').addEventListener('click', exportData);
    document.getElementById('clearStorage').addEventListener('click', clearStorage);
    document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
}

// Load quotes from local storage
function loadQuotesFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            quotes = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading from storage:', error);
        quotes = [];
    }
}

// Save quotes to local storage
function saveQuotesToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    } catch (error) {
        console.error('Error saving to storage:', error);
        showMessage('Error saving data', 'error');
    }
}

// Display a random quote
function displayRandomQuote(filteredQuotes = null) {
    const quoteArray = filteredQuotes || quotes;
    
    if (quoteArray.length === 0) {
        document.getElementById('quoteDisplay').innerHTML = `
            <p class="quote-text">No quotes available</p>
            <p class="quote-category">Add some quotes to get started!</p>
        `;
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * quoteArray.length);
    const quote = quoteArray[randomIndex];
    displayQuote(quote);
}

// Display a specific quote
function displayQuote(quote) {
    const display = document.getElementById('quoteDisplay');
    display.innerHTML = `
        <p class="quote-text">"${quote.text}"</p>
        <p class="quote-category">Category: ${quote.category}</p>
        <p class="quote-author">— ${quote.author || 'Unknown'}</p>
    `;
}

// Populate category filter dropdown
function populateCategoryFilter() {
    const categories = [...new Set(quotes.map(q => q.category))].sort();
    const select = document.getElementById('categoryFilter');
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">All Categories</option>';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}

// Filter quotes by category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filtered = selectedCategory === '' 
        ? quotes 
        : quotes.filter(q => q.category === selectedCategory);
    
    displayRandomQuote(filtered);
    displaySavedQuotes(filtered);
}

// Add a new quote
function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    const author = document.getElementById('newQuoteAuthor').value.trim();
    
    if (!text || !category) {
        showMessage('Please enter both quote text and category', 'error');
        return;
    }
    
    const newQuote = {
        text: text,
        category: category,
        author: author || 'Unknown'
    };
    
    quotes.push(newQuote);
    saveQuotesToStorage();
    populateCategoryFilter();
    displaySavedQuotes();
    
    // Clear form
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    document.getElementById('newQuoteAuthor').value = '';
    
    showMessage('Quote added successfully!', 'success');
}

// Display all saved quotes
function displaySavedQuotes(quoteArray = null) {
    const list = quoteArray || quotes;
    const container = document.getElementById('quotesList');
    
    if (list.length === 0) {
        container.innerHTML = '<p class="empty-state">No quotes saved yet</p>';
        return;
    }
    
    container.innerHTML = list.map((quote, index) => `
        <div class="quote-item">
            <div class="quote-item-text">"${quote.text}"</div>
            <div class="quote-item-category">${quote.category} • ${quote.author}</div>
            <button class="btn-sm" onclick="deleteQuote(${quotes.indexOf(quote)})">Delete</button>
        </div>
    `).join('');
}

// Delete a quote
function deleteQuote(index) {
    if (index >= 0 && index < quotes.length) {
        quotes.splice(index, 1);
        saveQuotesToStorage();
        populateCategoryFilter();
        filterQuotes();
        showMessage('Quote deleted successfully!', 'success');
    }
}

// Export quotes as JSON
function exportData() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
    URL.revokeObjectURL(url);
    showMessage('Quotes exported successfully!', 'success');
}

// Clear all storage
function clearStorage() {
    if (confirm('Are you sure you want to clear all quotes? This action cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        quotes = [];
        init();
        showMessage('All data cleared successfully!', 'success');
    }
}

// Show message feedback
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message show ${type}`;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'message';
    }, 3000);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
