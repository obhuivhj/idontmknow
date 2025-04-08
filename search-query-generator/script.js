const trendingKeywords = [
  "AI technology", "machine learning", "big data", "quantum computing", "cloud services",
  "web development", "SEO tips", "cryptocurrency news", "social media trends", "blockchain technology",
  "mobile development", "e-commerce", "remote work", "cybersecurity", "sustainable living"
];

const relatedKeywordsList = {
  "python": ["python coding", "python tutorial", "python programming", "learn python", "python scripts"],
  "javascript": ["js programming", "learn javascript", "javascript tutorial", "javascript code", "js developer"],
  "web development": ["web design", "html css", "frontend development", "backend development", "full stack developer"],
  "programming": ["coding", "software development", "developer", "programming languages", "algorithm design"],
};

let keywords = [];

// Load keywords from localStorage
window.onload = () => {
  const savedKeywords = localStorage.getItem('savedKeywords');
  if (savedKeywords) {
    keywords = JSON.parse(savedKeywords);
    renderKeywords();
  }
};

function generateSimilarKeywords() {
  const inputKeyword = document.getElementById('keywordInput').value.trim().toLowerCase();
  
  if (!inputKeyword) {
    document.getElementById('generatedKeywords').innerHTML = "<li>Please enter a keyword.</li>";
    return;
  }

  let suggestions = [];

  if (relatedKeywordsList[inputKeyword]) {
    suggestions = [...relatedKeywordsList[inputKeyword]];
  }

  const diversitySuggestions = trendingKeywords.filter(keyword => keyword.includes(inputKeyword));
  suggestions = [...new Set([...suggestions, ...diversitySuggestions])];

  if (suggestions.length === 0) {
    document.getElementById('generatedKeywords').innerHTML = "<li>No suggestions found.</li>";
    return;
  }

  const generatedList = suggestions.map((kw) => `
    <li>
      ${kw}
      <button class="save-btn" onclick="saveKeyword('${kw}')">Save</button>
    </li>
  `).join('');

  document.getElementById('generatedKeywords').innerHTML = generatedList;
}

function saveKeyword(keyword) {
  if (!keywords.some(k => k.value === keyword)) {
    keywords.push({ value: keyword, selected: false });
    renderKeywords();
    // Save keywords to localStorage
    localStorage.setItem('savedKeywords', JSON.stringify(keywords));
  }
}

function renderKeywords() {
  const keywordsList = document.getElementById('keywordsList');
  keywordsList.innerHTML = keywords.map(keyword => `
    <div class="keyword-item">
      <input type="checkbox" id="keyword-${keyword.value}" ${keyword.selected ? 'checked' : ''} onclick="toggleKeywordSelection('${keyword.value}')">
      <label for="keyword-${keyword.value}">${keyword.value}</label>
      <button class="remove-btn" onclick="removeKeyword('${keyword.value}')">✖</button>
    </div>
  `).join('');
  updateSearchLink();
}

function toggleKeywordSelection(keywordValue) {
  const keyword = keywords.find(k => k.value === keywordValue);
  if (keyword) {
    keyword.selected = !keyword.selected;
    updateSearchLink();
    // Save updated keywords to localStorage
    localStorage.setItem('savedKeywords', JSON.stringify(keywords));
  }
}

function removeKeyword(keywordValue) {
  keywords = keywords.filter(k => k.value !== keywordValue);
  renderKeywords();
  // Save updated keywords to localStorage
  localStorage.setItem('savedKeywords', JSON.stringify(keywords));
}

function updateSearchLink() {
  const activeKeywords = keywords.filter(k => k.selected).map(k => `"${k.value}"`);
  const optional = document.getElementById('optionalInput').value.trim();
  const query = [...activeKeywords, optional].filter(Boolean).join(' ');
  const url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
  document.getElementById('searchLink').href = url;
  document.getElementById('searchLink').textContent = url;
}

function parseKeywords() {
  const raw = document.getElementById('keywordInput').value.split(/[\n,]+/).map(k => k.trim()).filter(k => k !== '');
  keywords = raw.map(k => ({ value: k, selected: false }));
  renderKeywords();
  updateSearchLink();
  // Save parsed keywords to localStorage
  localStorage.setItem('savedKeywords', JSON.stringify(keywords));
}

function generateKeywordsFromText() {
  const inputText = document.getElementById('multiText').value.trim();
  const words = inputText.split(/\s+/).map(word => word.trim()).filter(word => word !== '');
  const uniqueWords = [...new Set(words)];
  document.getElementById('generatedKeywords').innerHTML = uniqueWords.map(word => `
    <li>${word} <button class="save-btn" onclick="saveKeyword('${word}')">Save</button></li>
  `).join('');
}

function exportToCSV() {
  const headers = ['Keyword'];
  const rows = keywords.map(keyword => [keyword.value]);
  
  let csvContent = 'data:text/csv;charset=utf-8,' 
                   + headers.join(',') 
                   + '\n'
                   + rows.map(e => e.join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'keywords.csv');
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link);
}