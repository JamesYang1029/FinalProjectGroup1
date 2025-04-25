let currentPage = 1;
let totalPages = 1;
let sortBy = 'market_cap';
let sortOrder = 'desc';

async function fetchTableData() {
  const priceMin = document.getElementById('priceMin').value;
  const priceMax = document.getElementById('priceMax').value;
  const marketCapMin = document.getElementById('marketCapMin').value;
  const marketCapMax = document.getElementById('marketCapMax').value;
  const athMin = document.getElementById('athMin').value;
  const athMax = document.getElementById('athMax').value;
  const atlMin = document.getElementById('atlMin').value;
  const atlMax = document.getElementById('atlMax').value;

  const res = await fetch(`/scanner/scannerTable?priceMin=${priceMin}&priceMax=${priceMax}&marketCapMin=${marketCapMin}&marketCapMax=${marketCapMax}&athMin=${athMin}&athMax=${athMax}&atlMin=${atlMin}&atlMax=${atlMax}&page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
  const data = await res.json();
  const tableBody = document.getElementById('scanner-table-body');
  tableBody.innerHTML = '';

  if (!data.cryptos || data.cryptos.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">No results</td></tr>';
    document.getElementById('pageNum').innerText = `Page 0 of 0`;
    totalPages = 1;
    return;
  }

  totalPages = data.totalPages;

  data.cryptos.forEach(c => {
    //add watchlist button in the table
    const watchlistCell = window.isLoggedInGlobal
      ? `<form method="POST" action="/watchlist/add/${c._id}">
           <button type="submit">Add to Watchlist</button>
         </form>`
      : '';
    const row = `
      <tr>
        <td>${c.name} (${c.symbol.toUpperCase()})</td>
        <td>$${c.current_price?.toLocaleString()}</td>
        <td>$${c.market_cap?.toLocaleString()}</td>
        <td>$${c.ath?.toLocaleString()}</td>
        <td>$${c.atl?.toLocaleString()}</td>
        <td>${c.price_change_percentage_24h?.toFixed(2)}%</td>
        <td>${watchlistCell}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });

  document.getElementById('pageNum').innerText = `Page ${currentPage} of ${totalPages}`;
  document.getElementById('totalPages').innerText = `/ Total: ${totalPages}`;

  // Enable/disable pagination buttons based on currentPage
  document.getElementById('prevPage').disabled = currentPage <= 1;
  document.getElementById('nextPage').disabled = currentPage >= totalPages;

  updateSortingArrows();
}

function updateSortingArrows() {
  // Reset all arrow visibility
  document.querySelectorAll('th').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
  });

  // Add appropriate sort class to the active column
  const sortedHeader = document.querySelector(`th[data-sort="${sortBy}"]`);
  if (sortedHeader) {
    sortedHeader.classList.add(sortOrder === 'asc' ? 'sort-asc' : 'sort-desc');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Listen for changes on the filter inputs
  document.querySelectorAll('#priceMin, #priceMax, #marketCapMin, #marketCapMax, #athMin, #athMax, #atlMin, #atlMax').forEach(input => {
    input.addEventListener('input', () => {
      currentPage = 1;
      fetchTableData();
    });
  });

  // Sorting logic
  document.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const newSortBy = th.getAttribute('data-sort');
      if (newSortBy === sortBy) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        sortBy = newSortBy;
        sortOrder = 'desc';
      }
      currentPage = 1;
      fetchTableData();
    });
  });

  // Pagination logic
  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchTableData();
    }
  });

  document.getElementById('nextPage').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchTableData();
    }
  });

  // "Go to page" functionality
  document.getElementById('pageInput').addEventListener('input', (e) => {
    let pageNum = parseInt(e.target.value);
    if (pageNum < 1) pageNum = 1;
    if (pageNum > totalPages) pageNum = totalPages;
    currentPage = pageNum;
    fetchTableData();
  });

  // Initial load
  fetchTableData();
});
