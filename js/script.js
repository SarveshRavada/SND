const shopConfig = {
  mapLat: 18.331324013002845,
  mapLng: 83.89669687188926,
  openHour: 7,
  closeHour: 19
};

function updateShopStatus() {
  const h = new Date().getHours();
  const open = h >= shopConfig.openHour && h < shopConfig.closeHour;
  const status = document.getElementById("shopStatus");

  if (!status) return;

  if (open) {
    status.textContent = "Open now";
    status.classList.remove("closed");
    status.classList.add("open");
  } else {
    status.textContent = "Closed now";
    status.classList.remove("open");
    status.classList.add("closed");
  }
}

function openWorkshopMap(e) {
  e.preventDefault();
  const url = `https://www.google.com/maps/search/?api=1&query=${shopConfig.mapLat},${shopConfig.mapLng}`;
  window.open(url, "_blank");
}

function bindMapControls() {
  const mapBtn = document.getElementById("mapBtn");
  const mobileMapBtn = document.getElementById("mobileMapBtn");

  if (mapBtn) {
    mapBtn.addEventListener("click", openWorkshopMap);
  }
  if (mobileMapBtn) {
    mobileMapBtn.addEventListener("click", openWorkshopMap);
  }
}

function setYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function initReviewSlider() {
  const viewport = document.getElementById("reviewsViewport");
  const track = document.getElementById("reviewTrack");
  const dots = document.querySelectorAll(".review-dot");

  if (!viewport || !track || !dots.length) return;

  let current = 0;

  const slideCount = dots.length;

  const go = (index) => {
    const next = Math.max(0, Math.min(slideCount - 1, index));
    current = next;

    track.style.transform = `translateX(-${next * 100}%)`;

    dots.forEach((d, i) => {
      d.classList.toggle("active", i === next);
      d.setAttribute("aria-selected", i === next ? "true" : "false");
    });
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => go(Number(dot.dataset.slide)));
  });

  viewport.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    },
    { passive: true }
  );

  go(0);
}

function initReviewForm() {
  const form = document.getElementById("customerReviewForm");
  const nameInput = document.getElementById("reviewName");
  const textInput = document.getElementById("reviewText");
  const listEl = document.getElementById("reviewList");
  const noticeEl = document.getElementById("reviewNotice");
  if (!form || !nameInput || !textInput || !listEl) return;

  const key = "snd_customer_reviews";
  const saved = localStorage.getItem(key);
  const reviews = saved ? JSON.parse(saved) : [];

  const render = () => {
    listEl.innerHTML = "";
    reviews.slice(-5).reverse().forEach((r) => {
      const card = document.createElement("div");
      card.className = "review-entry";
      card.innerHTML = `<strong>${r.name}</strong><p>${r.text}</p><time>${r.createdAt || ""}</time>`;
      listEl.appendChild(card);
    });
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    if (!name || !text) return;
    const createdAt = new Date().toLocaleString();
    reviews.push({ name, text, createdAt });
    localStorage.setItem(key, JSON.stringify(reviews));
    form.reset();
    render();

    if (noticeEl) {
      noticeEl.textContent = "Thanks for your review. If it doesn't appear across devices yet, please try again later due to technical sync limitations.";
    }
  });

  render();
}

updateShopStatus();
bindMapControls();
setYear();
initReviewSlider();
initReviewForm();
