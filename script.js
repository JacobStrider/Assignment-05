const gallery = document.getElementById("gallery");

window.onLoad = () => {
    loadRepos("JacobStrider");
};

document.getElementById("searchBtn").addEventListener("click", () => {
    loadRepos();
});

document.getElementById("username").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        loadRepos();
    }
});

function loadRepos(customUser) {
    const usernameInput = document.getElementById("username").value;
    const username = customUser || usernameInput;

    if (!username) return;

    gallery.innerHTML = "Loading...";

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`)
    .then(response => response.json())
    .then(repos => {
        gallery.innerHTML = "";

        if (repos.length === 0 || repos.message === "Not Found") {
            gallery.innerHTML = "No repositories found.";
            return;
        }

        repos.forEach(repo => {
            createRepoCard(repo);
        });
    })
    .catch(() => {
        gallery.innerHTML = "Error fetching repositories.";
    });
}

function createRepoCard(repo) {
    const card = document.createElement("div");
    card.className = "card";

    const languagesPromise = fetch(repo.languages_url)
        .then(res => res.json())
        .then(data => Object.keys(data).join(", ") || "None");


        languagesPromise.then(languages => {
            card.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || "No description"}</p>
                <p><strong>Created:</strong> ${formatDate(repo.created_at)}</p>
                <p><strong>Updated:</strong> ${formatDate(repo.updated_at)}</p>
                <p><strong>Languages:</strong> ${languages}</p>
                <p><strong>Watchers:</strong> ${repo.watchers_count}</p>
            `;
        });

        gallery.appendChild(card);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

        