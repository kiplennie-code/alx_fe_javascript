// Array to store quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "motivation" },
  { text: "It is during our darkest moments that we must focus to see the light.", category: "inspiration" },
  { text: "Be yourself; everyone else is already taken.", category: "wisdom" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "life" }
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

// Function to save last viewed quote to session storage
function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to display a random quote using createElement and appendChild
function showRandomQuote() {
  // Generate a random index
  const randomIndex = Math.floor(Math.random() * quotes.length);
  
  // Get the quote at that index
  const randomQuote = quotes[randomIndex];
  
  // Save to session storage
  saveLastViewedQuote(randomQuote);
  
  // Get the quote display element
  const quoteDisplay = document.getElementById("quoteDisplay");
  
  // Clear previous content
  quoteDisplay.innerHTML = "";
  
  // Create paragraph element for quote text
  const quoteText = document.createElement("p");
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteText.style.fontWeight = "bold";
  quoteText.style.fontSize = "18px";
  
  // Create paragraph element for category
  const quoteCategory = document.createElement("p");
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  quoteCategory.className = "category";
  quoteCategory.style.fontStyle = "italic";
  quoteCategory.style.color = "#666";
  
  // Append elements to quote display
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
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
  
  // Save to local storage
  saveQuotes();
  
  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  
  // Show success message
  alert("Quote added successfully!");
  
  // Optionally display the newly added quote
  showRandomQuote();
}

// Function to export quotes to JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  
  URL.revokeObjectURL(url);
  alert('Quotes exported successfully!');
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to create the add quote form dynamically using createElement
function createAddQuoteForm() {
  // Create container div
  const formDiv = document.createElement("div");
  formDiv.className = "add-quote-section";
  
  // Create heading
  const heading = document.createElement("h3");
  heading.textContent = "Add Your Own Quote";
  
  // Create input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  
  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  
  // Create add button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;
  
  // Append all elements to form div
  formDiv.appendChild(heading);
  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);
  
  // Return the form or append to body
  document.body.appendChild(formDiv);
}

// Add event listener to the "Show New Quote" button
const newQuoteButton = document.getElementById("newQuote");
newQuoteButton.addEventListener("click", showRandomQuote);

// Load quotes from local storage when page loads
loadQuotes();

// Display a random quote when the page loads
showRandomQuote();
