// Array to store quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "motivation" },
  { text: "It is during our darkest moments that we must focus to see the light.", category: "inspiration" },
  { text: "Be yourself; everyone else is already taken.", category: "wisdom" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "life" }
];

// Function to display a random quote
function showRandomQuote() {
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  
  // Get the quote at that index
  const randomQuote = quotes[randomIndex];
  
  // Get the quote display element
  const quoteDisplay = document.getElementById("quoteDisplay");
  
  // Update the display with the quote
  quoteDisplay.innerHTML = `
    <p><strong>"${randomQuote.text}"</strong></p>
    <p class="category">Category: ${randomQuote.category}</p>
  `;
}

// Function to add a new quote
function addQuote() {
  // Get input values
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  // Validate input
  if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
    alert("Please enter both a quote and a category!");
    return;
  }
  
  // Create new quote object
  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory
  };
  
  // Add to quotes array
  quotes.push(newQuote);
  
  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  
  // Show success message
  alert("Quote added successfully!");
  
  // Optionally display the newly added quote
  showRandomQuote();
}

// Function to create the add quote form (alternative implementation)
function createAddQuoteForm() {
  const formHTML = `
    <div>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    </div>
  `;
  
  // You can insert this wherever needed in your DOM
  return formHTML;
}

// Add event listener to the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Display a random quote when the page loads
showRandomQuote();
