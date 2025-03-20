const API_HOST = "free-to-play-games-database.p.rapidapi.com";
const API_KEY = "63cfcd3668msh8999dab45fbfaf8p1941efjsn92b4b1bf298d"; 
let allGames = [];

// Fetch game list
function fetchGames() {
    $.ajax({
        url: "https://free-to-play-games-database.p.rapidapi.com/api/games",
        method: "GET",
        headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY
        },
        success: function (games) {
            allGames = games; 
            displayGames(games);
        },
        error: function (err) {
            console.error("Error fetching games:", err);
        }
    });
}

// Display game list
function displayGames(games) {
    let gameListHtml = "";
    games.forEach(game => {
        gameListHtml += `
            <div class="col-md-4">
                <div class="card mb-3">
                    <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}">
                    <div class="card-body">
                        <h5 class="card-title">${game.title}</h5>
                        <p class="card-text" style="
                            display: -webkit-box;
                            -webkit-line-clamp: 2;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                        ">
                            ${game.short_description}
                        </p>
                        <button class="btn btn-primary" onclick="fetchGameDetails(${game.id})" data-toggle="modal" data-target="#gameModal">View Details</button>
                    </div>
                </div>
            </div>
        `;
    });
    $("#game-list").html(gameListHtml);
}

// Fetch game details
function fetchGameDetails(gameId) {
    $.ajax({
        url: `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`,
        method: "GET",
        headers: {
            "x-rapidapi-host": API_HOST,
            "x-rapidapi-key": API_KEY
        },
        success: function (game) {
            let gameDetailsHtml = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${game.thumbnail}" class="img-fluid mb-3" alt="${game.title}">
                        <a href="${game.game_url}" target="_blank" class="btn btn-success btn-block">Play Now</a>
                    </div>
                    <div class="col-md-8">
                        <h3>${game.title} <small class="badge badge-success">${game.status}</small></h3>
                        <p><strong>Genre:</strong> ${game.genre}</p>
                        <p><strong>Platform:</strong> ${game.platform}</p>
                        <p><strong>Publisher:</strong> ${game.publisher}</p>
                        <p><strong>Developer:</strong> ${game.developer}</p>
                        <p><strong>Release Date:</strong> ${game.release_date}</p>
                        <p><strong>Description:</strong> ${game.description}</p>
                    </div>
                </div>

                <h5 class="mt-4">Minimum System Requirements</h5>
                <ul>
                    <li><strong>OS:</strong> ${game.minimum_system_requirements?.os || "N/A"}</li>
                    <li><strong>Processor:</strong> ${game.minimum_system_requirements?.processor || "N/A"}</li>
                    <li><strong>Memory:</strong> ${game.minimum_system_requirements?.memory || "N/A"}</li>
                    <li><strong>Graphics:</strong> ${game.minimum_system_requirements?.graphics || "N/A"}</li>
                    <li><strong>Storage:</strong> ${game.minimum_system_requirements?.storage || "N/A"}</li>
                </ul>

                <h5 class="mt-4">Screenshots</h5>
                <div class="row">
                    ${game.screenshots?.map(screenshot => `
                        <div class="col-md-4">
                            <img src="${screenshot.image}" class="img-fluid mb-2" alt="Screenshot">
                        </div>
                    `).join("") || "<p>No screenshots available.</p>"}
                </div>
            `;
            $("#game-details").html(gameDetailsHtml);
        },
        error: function (err) {
            console.error("Error fetching game details:", err);
        }
    });
}


// Search games
function searchGames() {
    let query = $("#input-search").val().toLowerCase();
    let filteredGames = allGames.filter(game => game.title.toLowerCase().includes(query));
    displayGames(filteredGames);
}

$("#button-search").click(searchGames);

$("#input-search").on("keypress", function (event) {
    if (event.keyCode === 13) {
        searchGames(); 
    }
});


$(document).ready(fetchGames);
