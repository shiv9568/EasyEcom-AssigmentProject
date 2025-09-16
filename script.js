document.addEventListener("DOMContentLoaded", function () {
  const charactersContainer = document.getElementById("characters-container");
  const searchInput = document.getElementById("search-input");
  const statusFilter = document.getElementById("status-filter");
  const genderFilter = document.getElementById("gender-filter");
  const speciesFilter = document.getElementById("species-filter");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentPage = 1;
  let totalPages = 0;
  let currentFilters = {};

  function fetchCharacters(page = 1, filters = {}) {
    let apiUrl = `https://rickandmortyapi.com/api/character?page=${page}`;

    const filterParams = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) {
        filterParams.append(key, filters[key]);
      }
    }

    if (filterParams.toString()) {
      apiUrl += `&${filterParams.toString()}`;
    }

    charactersContainer.innerHTML =
      '<div class="loading">Loading characters...</div>';

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        displayCharacters(data.results);
        currentPage = page;
        totalPages = data.info.pages;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
      })
      .catch((error) => {
        charactersContainer.innerHTML = `<div class="error">Error loading characters: ${error.message}</div>`;
        console.error("Error:", error);
      });
  }

  function displayCharacters(characters) {
    if (!characters || characters.length === 0) {
      charactersContainer.innerHTML =
        '<div class="error">No characters found with these filters</div>';
      return;
    }

    charactersContainer.innerHTML = "";

    characters.forEach((character) => {
      const card = document.createElement("div");
      card.className = "character-card";

      const firstEpisode = character.episode[0];
      const episodeId = firstEpisode.split("/").pop();

      card.innerHTML = `
                        <div class="character-image">
                            <img src="${character.image}" alt="${
        character.name
      }">
                        </div>
                        <div class="character-details">
                            <div>
                                <h2 class="character-name">${
                                  character.name
                                }</h2>
                                <p class="character-info"><i class="fas ${getStatusIcon(
                                  character.status
                                )}"></i> ${character.status} - ${
        character.species
      }</p>
                                <p class="character-info"><i class="fas fa-venus-mars"></i> ${
                                  character.gender
                                }</p>
                                <p class="character-info"><i class="fas fa-globe-americas"></i> ${
                                  character.origin.name
                                }</p>
                            </div>
                            <p class="character-info"><i class="fas fa-tv"></i> First seen in episode ${episodeId}</p>
                        </div>
                    `;

      charactersContainer.appendChild(card);
    });
  }

  function getStatusIcon(status) {
    switch (status.toLowerCase()) {
      case "alive":
        return "fa-heart";
      case "dead":
        return "fa-skull";
      default:
        return "fa-question-circle";
    }
  }

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      currentFilters = {
        name: searchInput.value.trim() || "",
        status: statusFilter.value,
        gender: genderFilter.value,
        species: speciesFilter.value,
      };

      fetchCharacters(1, currentFilters);
    }
  });

  statusFilter.addEventListener("change", applyFilters);
  genderFilter.addEventListener("change", applyFilters);
  speciesFilter.addEventListener("change", applyFilters);

  function applyFilters() {
    currentFilters = {
      name: searchInput.value.trim() || "",
      status: statusFilter.value,
      gender: genderFilter.value,
      species: speciesFilter.value,
    };

    fetchCharacters(1, currentFilters);
  }

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      fetchCharacters(currentPage - 1, currentFilters);
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      fetchCharacters(currentPage + 1, currentFilters);
    }
  });

  fetchCharacters();
});
