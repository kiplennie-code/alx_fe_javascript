// Array to store quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "motivation" },
  { text: "It is during our darkest moments that we must focus to see the light.", category: "inspiration" },
  { text: "Be yourself; everyone else is already taken.", category: "wisdom" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "life" }
];

// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================

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

// Function to save last selected category filter
function saveLastSelectedCategory(category) {
  localStorage.setItem('lastSelectedCategory', category);
}

// Function to load last selected category filter
function loadLastSelectedCategory() {
  return localStorage.getItem('lastSelectedCategory') || 'all';
}

// ============================================
// CATEGORY FILTERING FUNCTIONS (TASK 2)
// ============================================

// Function to populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Extract unique categories from quotes array
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  
  // Clear existing options except "All Categories"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  // Add each unique category as an option
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });
  
  // Restore the last selected category from local storage
  const lastSelectedCategory = loadLastSelectedCategory();
  categoryFilter.value = lastSelectedCategory;
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  
  // Save the selected category to local storage
  saveLastSelectedCategory(selectedCategory);
  
  // Filter quotes based on selected category
  let filteredQuotes;
  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  
  // Display a random quote from the filtered quotes
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p style="font-style: italic; color: #999;">No quotes available for this category.</p>';
    return;
  }
  
  // Get a random quote from filtered results
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  
  // Save to session storage
  saveLastViewedQuote(randomQuote);
  
  // Clear previous content
  quoteDisplay.innerHTML = '';
  
  // Create and append quote text
  const quoteText = document.createElement('p');
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteText.style.fontWeight = 'bold';
  quoteText.style.fontSize = '18px';
  
  // Create and append category
  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  quoteCategory.className = 'category';
  quoteCategory.style.fontStyle = 'italic';
  quoteCategory.style.color = '#666';
  
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

// ============================================
// QUOTE DISPLAY FUNCTIONS
// ============================================

// Function to display a random quote using createElement and appendChild
function showRandomQuote() {
  // Use the filterQuotes function to display based on current filter
  filterQuotes();
}

// ============================================
// ADD QUOTE FUNCTION
// ============================================

// Function to add a new quote
function addQuote() {
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
  
  // Update categories dropdown (in case new category was added)
  populateCategories();
  
  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  
  // Show success message
  alert("Quote added successfully!");
  
  // Display the newly added quote
  showRandomQuote();
}

// ============================================
// JSON IMPORT/EXPORT FUNCTIONS
// ============================================

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
    populateCategories(); // Update categories after import
    alert('Quotes imported successfully!');
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

// ============================================
// DYNAMIC FORM CREATION (OPTIONAL)
// ============================================

// Function to create the add quote form dynamically using createElement
function createAddQuoteForm() {
  const formDiv = document.createElement("div");
  formDiv.className = "add-quote-section";
  
  const heading = document.createElement("h3");
  heading.textContent = "Add Your Own Quote";
  
  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";
  
  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";
  
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;
  
  formDiv.appendChild(heading);
  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);
  
  document.body.appendChild(formDiv);
}

// ============================================
// INITIALIZATION
// ============================================

// Load quotes from local storage when page loads
loadQuotes();

// Populate categories dropdown
populateCategories();

// Add event listener to the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Display a quote based on last selected filter when page loads
showRandomQuote();
