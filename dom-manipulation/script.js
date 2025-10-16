// Array to store quotes
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", category: "motivation" },
  { text: "It is during our darkest moments that we must focus to see the light.", category: "inspiration" },
  { text: "Be yourself; everyone else is already taken.", category: "wisdom" },
  { text: "In three words I can sum up everything I've learned about life: it goes on.", category: "life" }
];

// Server configuration
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
let syncInterval = null;
let pendingConflicts = [];

// ============================================
// LOCAL STORAGE FUNCTIONS
// ============================================

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  }
}

function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function saveLastSelectedCategory(category) {
  localStorage.setItem('lastSelectedCategory', category);
}

function loadLastSelectedCategory() {
  return localStorage.getItem('lastSelectedCategory') || 'all';
}

// ============================================
// CATEGORY FILTERING FUNCTIONS
// ============================================

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    categoryFilter.appendChild(option);
  });
  
  const lastSelectedCategory = loadLastSelectedCategory();
  categoryFilter.value = lastSelectedCategory;
}

function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;
  
  saveLastSelectedCategory(selectedCategory);
  
  let filteredQuotes;
  if (selectedCategory === 'all') {
    filteredQuotes = quotes;
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }
  
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = '<p style="font-style: italic; color: #999;">No quotes available for this category.</p>';
    return;
  }
  
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  
  saveLastViewedQuote(randomQuote);
  
  quoteDisplay.innerHTML = '';
  
  const quoteText = document.createElement('p');
  quoteText.textContent = `"${randomQuote.text}"`;
  quoteText.style.fontWeight = 'bold';
  quoteText.style.fontSize = '18px';
  
  const quoteCategory = document.createElement('p');
  quoteCategory.textContent = `Category: ${randomQuote.category}`;
  quoteCategory.className = 'category';
  quoteCategory.style.fontStyle = 'italic';
  quoteCategory.style.color = '#666';
  
  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
}

function showRandomQuote() {
  filterQuotes();
}

// ============================================
// ADD QUOTE FUNCTION
// ============================================

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
  if (newQuoteText.trim() === "" || newQuoteCategory.trim() === "") {
    alert("Please enter both a quote and a category!");
    return;
  }
  
  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory
  };
  
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  
  showNotification("Quote added successfully!", "success");
  
  // Post to server
  postQuoteToServer(newQuote);
  
  showRandomQuote();
}

// ============================================
// JSON IMPORT/EXPORT FUNCTIONS
// ============================================

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  
  URL.revokeObjectURL(url);
  showNotification('Quotes exported successfully!', 'success');
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    showNotification('Quotes imported successfully!', 'success');
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// ============================================
// SERVER SYNC FUNCTIONS (TASK 3)
// ============================================

// Update sync status UI
function updateSyncStatus(status, message) {
  const indicator = document.getElementById('syncIndicator');
  const statusText = document.getElementById('syncStatus');
  
  indicator.className = `status-indicator ${status}`;
  statusText.textContent = message;
  
  if (status === 'synced') {
    const now = new Date().toLocaleTimeString();
    document.getElementById('lastSyncTime').textContent = now;
  }
}

// Fetch quotes from server (simulated)
async function fetchQuotesFromServer() {
  try {
    updateSyncStatus('syncing', 'Syncing with server...');
    
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    
    // Simulate server quotes (convert posts to quote format)
    const serverQuotes = serverData.slice(0, 5).map((post, index) => ({
      text: post.title,
      category: index % 2 === 0 ? 'server' : 'wisdom',
      id: post.id
    }));
    
    return serverQuotes;
  } catch (error) {
    console.error('Error fetching from server:', error);
    updateSyncStatus('error', 'Sync failed');
    showNotification('Failed to fetch data from server', 'error');
    return [];
  }
}

// Post quote to server (simulated)
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1
      })
    });
    
    const data = await response.json();
    console.log('Quote posted to server:', data);
    showNotification('Quote synced with server!', 'success');
  } catch (error) {
    console.error('Error posting to server:', error);
    showNotification('Failed to sync quote with server', 'error');
  }
}

// Detect conflicts between local and server data
function detectConflicts(serverQuotes) {
  const conflicts = [];
  
  serverQuotes.forEach(serverQuote => {
    const localMatch = quotes.find(q => 
      q.text.toLowerCase() === serverQuote.text.toLowerCase()
    );
    
    if (localMatch && localMatch.category !== serverQuote.category) {
      conflicts.push({
        local: localMatch,
        server: serverQuote
      });
    }
  });
  
  return conflicts;
}

// Show conflict resolution modal
function showConflictModal(conflicts) {
  pendingConflicts = conflicts;
  const modal = document.getElementById('conflictModal');
  const detailsDiv = document.getElementById('conflictDetails');
  
  detailsDiv.innerHTML = '';
  
  conflicts.forEach((conflict, index) => {
    const conflictDiv = document.createElement('div');
    conflictDiv.className = 'conflict-item';
    conflictDiv.innerHTML = `
      <strong>Conflict ${index + 1}:</strong><br>
      <strong>Local:</strong> "${conflict.local.text}" (${conflict.local.category})<br>
      <strong>Server:</strong> "${conflict.server.text}" (${conflict.server.category})
    `;
    detailsDiv.appendChild(conflictDiv);
  });
  
  modal.style.display = 'block';
}

// Resolve conflicts based on user choice
function resolveConflict(strategy) {
  const modal = document.getElementById('conflictModal');
  
  pendingConflicts.forEach(conflict => {
    const index = quotes.findIndex(q => q.text === conflict.local.text);
    
    if (strategy === 'server') {
      // Use server data
      quotes[index] = conflict.server;
    } else if (strategy === 'local') {
      // Keep local data (do nothing)
    } else if (strategy === 'merge') {
      // Keep both as separate entries
      quotes.push(conflict.server);
    }
  });
  
  saveQuotes();
  populateCategories();
  showRandomQuote();
  
  modal.style.display = 'none';
  showNotification(`Conflicts resolved using ${strategy} strategy`, 'success');
  pendingConflicts = [];
}

// Main sync function
async function syncQuotes() {
  const syncButton = document.getElementById('syncButton');
  syncButton.disabled = true;
  
  try {
    const serverQuotes = await fetchQuotesFromServer();
    
    if (serverQuotes.length === 0) {
      updateSyncStatus('error', 'No data from server');
      syncButton.disabled = false;
      return;
    }
    
    // Detect conflicts
    const conflicts = detectConflicts(serverQuotes);
    
    if (conflicts.length > 0) {
      // Show conflict resolution UI
      updateSyncStatus('warning', 'Conflicts detected');
      showConflictModal(conflicts);
      showNotification(`${conflicts.length} conflict(s) detected. Please resolve.`, 'warning');
      syncButton.disabled = false;
      return;
    }
    
    // No conflicts - merge data
    let newQuotesAdded = 0;
    
    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(q => 
        q.text.toLowerCase() === serverQuote.text.toLowerCase()
      );
      
      if (!exists) {
        quotes.push(serverQuote);
        newQuotesAdded++;
      }
    });
    
    if (newQuotesAdded > 0) {
      saveQuotes();
      populateCategories();
      updateSyncStatus('synced', 'Synced successfully');
      showNotification(`Synced! ${newQuotesAdded} new quote(s) added.`, 'success');
      showRandomQuote();
    } else {
      updateSyncStatus('synced', 'Already up to date');
      showNotification('Local data is up to date', 'info');
    }
    
  } catch (error) {
    console.error('Sync error:', error);
    updateSyncStatus('error', 'Sync failed');
    showNotification('Sync failed. Please try again.', 'error');
  } finally {
    syncButton.disabled = false;
  }
}

// Toggle auto-sync
function toggleAutoSync() {
  const autoSyncCheckbox = document.getElementById('autoSyncToggle');
  
  if (autoSyncCheckbox.checked) {
    // Start auto-sync every 30 seconds
    syncInterval = setInterval(syncQuotes, 30000);
    showNotification('Auto-sync enabled (every 30 seconds)', 'info');
  } else {
    // Stop auto-sync
    if (syncInterval) {
      clearInterval(syncInterval);
      syncInterval = null;
    }
    showNotification('Auto-sync disabled', 'info');
  }
}

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
  loadQuotes();
  populateCategories();
  
  const newQuoteButton = document.getElementById("newQuote");
  newQuoteButton.addEventListener("click", showRandomQuote);
  
  showRandomQuote();
  
  // Start auto-sync if enabled
  const autoSyncCheckbox = document.getElementById('autoSyncToggle');
  if (autoSyncCheckbox.checked) {
    syncInterval = setInterval(syncQuotes, 30000);
  }
  
  // Initial sync on page load
  setTimeout(() => {
    showNotification('Ready! Click "Sync with Server Now" to start.', 'info');
  }, 1000);
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
