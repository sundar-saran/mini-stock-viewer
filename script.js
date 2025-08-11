const apiURL = "https://dummyjson.com/products";
const carouselContent = document.getElementById("carouselContent");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

let companies = [];
let chartInstance = null;


fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    companies = data.products.map(p => ({
      name: p.title,
      price: p.price,
      rating: p.rating
    }));
    applyUserPreferences();
    renderCarousel(companies);
    drawChart(companies);
  });


function renderCarousel(data) {
  carouselContent.innerHTML = "";
  for (let i = 0; i < data.length; i += 2) {
    const slide = document.createElement("div");
    slide.classList.add("carousel-item");
    if (i === 0) slide.classList.add("active");

    const c1 = data[i];
    const c2 = data[i + 1];
    const c3 = data[i+2];
    const c4 = data[i+3]; 

    slide.innerHTML = `
      <div class="float-container">
        <div class="float-child bg-secondary">
          <h5>${c1.name}</h5>
          <p>Price: $${c1.price}</p>
          <p>Rating: ${c1.rating}</p>
        </div>
        ${c2 ? `
        <div class="float-child bg-secondary">
          <h5>${c2.name}</h5>
          <p>Price: $${c2.price}</p>
          <p>Rating: ${c2.rating}</p>
        </div>` : ''}
        ${c3 ? `
        <div class="float-child bg-secondary">
          <h5>${c2.name}</h5>
          <p>Price: $${c2.price}</p>
          <p>Rating: ${c2.rating}</p>
        </div>` : ''}
        ${c4 ? `
        <div class="float-child bg-secondary">
          <h5>${c2.name}</h5>
          <p>Price: $${c2.price}</p>
          <p>Rating: ${c2.rating}</p>
        </div>` : ''}
      </div>`;
    carouselContent.appendChild(slide);
  }
}


function drawChart(data) {
  const topFive = [...data].sort((a, b) => b.price - a.price).slice(0, 5);
  const labels = topFive.map(c => c.name);
  const prices = topFive.map(c => c.price);

  const ctx = document.getElementById("stockChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: "Stock Price",
        data: prices,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}


searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  const filtered = companies.filter(c => c.name.toLowerCase().includes(keyword));
  renderCarousel(filtered);
  drawChart(filtered);
});


sortSelect.addEventListener("change", () => {
  const sortBy = sortSelect.value;
  localStorage.setItem("sortPreference", sortBy);
  const sorted = [...companies].sort((a, b) => b[sortBy] - a[sortBy]);
  renderCarousel(sorted);
  drawChart(sorted);
});


function applyUserPreferences() {
  const pref = localStorage.getItem("sortPreference") || "price";
  sortSelect.value = pref;
  companies.sort((a, b) => b[pref] - a[pref]);
}
