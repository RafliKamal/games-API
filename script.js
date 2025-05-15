const NEWS_API_KEY = "f3685549a70c41a493b3cd0ecda9e4db";
let allArticles = [];

// Fetch news articles
function fetchNews(query = "apple") {
    $.ajax({
        url: `https://newsapi.org/v2/everything?q=${query}&apiKey=${NEWS_API_KEY}`,
        method: "GET",
        success: function (response) {
            if (response.status === "ok") {
                allArticles = response.articles;
                displayNews(allArticles);
                populateSourceFilter(allArticles);
            }
        },
        error: function (err) {
            console.error("Error fetching news:", err);
        }
    });
}

// Display news
function displayNews(articles) {
    let newsHtml = "";
    articles.forEach((article, index) => {
        newsHtml += `
            <div class="col-md-4">
                <div class="card mb-3">
                    <img src="${article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'}" class="card-img-top" alt="${article.title}">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">${article.description || "No description available."}</p>
                        <button class="btn btn-primary" onclick="showDetails(${index})" data-toggle="modal" data-target="#newsModal">Read More</button>
                    </div>
                </div>
            </div>
        `;
    });

    $("#news-list").html(newsHtml);
}

// Populate source filter dropdown
function populateSourceFilter(articles) {
    let sources = [...new Set(articles.map(article => article.source.name))];
    let sourceOptions = `<option value="">All Sources</option>`;
    sources.forEach(source => {
        sourceOptions += `<option value="${source}">${source}</option>`;
    });
    $("#source-filter").html(sourceOptions);
}

// Show full article detail
function showDetails(index) {
    let article = allArticles[index];
    let detailsHtml = `
        <h3>${article.title}</h3>
        <p><strong>Source:</strong> ${article.source.name}</p>
        <p><strong>Published At:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
        <p><strong>Author:</strong> ${article.author || "Unknown"}</p>
        <img src="${article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'}" class="img-fluid my-3" />
        <p>${article.content || "No content available."}</p>
        <a href="${article.url}" target="_blank" class="btn btn-success">Read Full Article</a>
    `;
    $("#news-details").html(detailsHtml);
}

// Filter by keyword and source
function searchAndFilterNews() {
    let keyword = $("#input-search").val().toLowerCase();
    let selectedSource = $("#source-filter").val();

    let filtered = allArticles.filter(article => {
        let matchKeyword = article.title.toLowerCase().includes(keyword) || article.description?.toLowerCase().includes(keyword);
        let matchSource = selectedSource === "" || article.source.name === selectedSource;
        return matchKeyword && matchSource;
    });

    if (filtered.length === 0) {
        $("#news-list").html(`<div class="col-12 text-center"><h3 class="text-muted">No articles found</h3></div>`);
    } else {
        displayNews(filtered);
    }
}

// Events
$("#button-search").click(searchAndFilterNews);
$("#input-search").on("keypress", function (e) {
    if (e.keyCode === 13) searchAndFilterNews();
});
$("#source-filter").change(searchAndFilterNews);

$(document).ready(() => fetchNews());
