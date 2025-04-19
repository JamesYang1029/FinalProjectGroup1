// Admin Update Handling
const updateMethod = document.getElementById('updateMethod');
const apiOptions = document.getElementById('apiOptions');
const manualOptions = document.getElementById('manualOptions');
const jsonFileInput = document.getElementById('jsonFile');
const form = document.getElementById('updateForm');

// Required keys for JSON validation
const requiredKeys = [
  "id", "symbol", "name", "image", "current_price", "market_cap",
  "market_cap_rank", "fully_diluted_valuation", "total_volume",
  "high_24h", "low_24h", "price_change_24h", "price_change_percentage_24h",
  "market_cap_change_24h", "market_cap_change_percentage_24h",
  "circulating_supply", "total_supply", "max_supply",
  "ath", "ath_change_percentage", "ath_date", "atl",
  "atl_change_percentage", "atl_date", "roi", "last_updated"
];

updateMethod.addEventListener('change', function () {
  apiOptions.classList.toggle('hidden', this.value !== 'api');
  manualOptions.classList.toggle('hidden', this.value !== 'manual');
});

form.addEventListener('submit', function (e) {
  const method = updateMethod.value;

  // Ensure a valid update method is selected
  if (!method) {
    alert("Please select an update method.");
    e.preventDefault();
    return;
  }

  // Manual update handling
  if (method === 'manual') {
    const file = jsonFileInput.files[0];
    if (!file) {
      alert("Please upload a JSON file.");
      e.preventDefault();
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const json = JSON.parse(event.target.result);
        if (!Array.isArray(json)) throw new Error("Top-level JSON must be an array.");
        
        // Validate all required keys
        for (const item of json) {
          for (const key of requiredKeys) {
            if (!(key in item)) {
              throw new Error(`Missing key "${key}" in one of the entries.`);
            }
          }
        }
        form.submit(); // Form is valid, allow submission
      } catch (err) {
        alert("Invalid JSON format: " + err.message);
      }
    };
    reader.readAsText(file);
    e.preventDefault(); // Prevent form submission until validation passes
  }

  // API update handling
  if (method === 'api') {
    const updateMode = document.getElementById('updateMode').value;
    if (!updateMode) {
      alert("Please select an update mode.");
      e.preventDefault();
      return;
    }
  }
});

