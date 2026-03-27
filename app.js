// Configure your sources here
const SOURCES = [
  { name: "BBC",     url: "https://feeds.bbci.co.uk/news/rss.xml" },
  { name: "Reuters", url: "https://feeds.reuters.com/reuters/topNews" },
  { name: "HN",      url: "https://hnrss.org/frontpage" },
];

const API = "https://api.rss2json.com/v1/api.json?rss_url=";

// Build the source tab buttons
function buildTabs() {
  const tabs = document.getElementById("tabs");
  SOURCES.forEach((src, i) => {
    const btn = document.createElement("button");
    btn.textContent = src.name;
    btn.className = i === 0 ? "tab active" : "tab";
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      loadFeed(src.url);
    });
    tabs.appendChild(btn);
  });
}

// Fetch and render a feed
async function loadFeed(rssUrl) {
  const status = document.getElementById("status");
  const feedEl = document.getElementById("feed");
  status.textContent = "Loading...";
  feedEl.innerHTML = "";

  try {
    const res  = await fetch(API + encodeURIComponent(rssUrl));
    const data = await res.json();
    if (data.status !== "ok") throw new Error("Feed error");

    status.textContent = "";

    data.items.forEach(item => {
      const li   = document.createElement("li");
      const date = new Date(item.pubDate).toLocaleDateString("en-GB", {
        day: "numeric", month: "short"
      });
      li.innerHTML = `
        <a href="${item.link}" target="_blank" rel="noopener">${item.title}</a>
        <span class="meta">${date}</span>
      `;
      feedEl.appendChild(li);
    });

  } catch (err) {
    status.textContent = "Failed to load feed. Try another source.";
  }
}

buildTabs();
loadFeed(SOURCES[0].url);