// Initialize quotes array with sample data
let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Innovation distinguishes between a leader and a follower.", category: "Leadership" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "Motivation" }
];

/**
 * Initialize on page load
 * Sets up event listeners and displays initial content
 */
document.addEventListener('DOMContentLoaded', function() {
    displayAllQuotes();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
});

/**
 * Display a random quote from the array
 * Updates the quote display section with random quote text and category
 */
function showRandomQuote() {
    if (quotes.length === 0) {
        alert('No quotes available. Please add some quotes first.');
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <div class="quote-text">"${randomQuote.text}"</div>
        <div class="quote-category">Category: ${randomQuote.category}</div>
    `;
}

/**
 * Add a new quote to the array and update display
 * Validates user input before adding
 * Clears input fields after successful addition
 * Shows success message and updates display
 */
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value.trim();
    const quoteCategory = document.getElementById('newQuoteCategory').value.trim();

    // Validation: Check if both fields are filled
    if (!quoteText || !quoteCategory) {
        alert('Please enter both quote text and category.');
        return;
    }

    // Create quote object
    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };

    // Add to quotes array
    quotes.push(newQuote);

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Show success message
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 2000);

    // Update display
    displayAllQuotes();
}

/**
 * Display all quotes in the list
 * Renders each quote with its index, text, and category
 * Shows a message if no quotes exist
 */
function displayAllQuotes() {
    const quotesList = document.getElementById('quotesList');
    quotesList.innerHTML = '';

    if (quotes.length === 0) {
        quotesList.innerHTML = '<p style="color: #999;">No quotes yet. Add one to get started!</p>';
        return;
    }

    quotes.forEach((quote, index) => {
        const quoteItem = document.createElement('div');
        quoteItem.className = 'quote-item';
        quoteItem.innerHTML = `
            <div class="quote-item-text">${index + 1}. "${quote.text}"</div>
            <div class="quote-item-category">${quote.category}</div>
        `;
        quotesList.appendChild(quoteItem);
    });
}
