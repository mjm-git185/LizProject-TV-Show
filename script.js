//You can edit ALL of the code here
// adds veriadles needed in the global scope

let allEpisodes = [];
let episodeCountFromSearch = document.getElementById("episodeCountFromSearch");
const rootElem = document.getElementById("root");
let id = 1; // default show id, will be updated when the user selects a show from the dropdown
function setup() {
  let url = `https://api.tvmaze.com/shows/${id}/episodes`;
  rootElem.textContent = "Loading...";
  getAllShows();

  const loadData = async (url) => {
    const response = await fetch(url);
    return await response.json();
  };
  loadData(url)
    .then((episodes) => {
      allEpisodes = episodes;
      makePageForEpisodes(allEpisodes);
      episodeCountFromSearch.innerHTML = `${allEpisodes.length} Episodes`; //adds the message for the search result
      selectShow();
      selectEpisodes();
      selectedEpisodeFiltered();
      return allEpisodes; //passed the allEpisodes array further
    })
    .catch((error) => {
      rootElem.textContent = "...something went wrong";
    });
}

// gets the data from the serch bar and updates live
function searchBarSetUp() {
  let searchInput = document.getElementById("search"); //gets the search input
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase(); // adds the listener to the function
    const searchResults = []; //an array to store the search results
    for (const episode of allEpisodes) {
      const { name, summary } = episode; // extracts the name and summery
      const resultsOfSearchName = name.toLowerCase().includes(searchTerm); // evaluates the search
      const resultsOfSearchSummery = summary.toLowerCase().includes(searchTerm);
      if (resultsOfSearchName || resultsOfSearchSummery) {
        searchResults.push(episode);
      } //if the search term is found in either name or summery, the episode is added to the searchResults array
    }

    makePageForEpisodes(searchResults); //and the page is updated with the search results
    if (searchResults.length != 0) {
      episodeCountFromSearch.innerHTML = `${searchResults.length} Episodes`;
    } // adds the appropriat message after the search
    else {
      episodeCountFromSearch.innerHTML = `No episodes found`;
    }
  });
}
//this function collects details for the future card. for example: detail-image; detail-name; detail-description and so on
function createChildElement(parentElement, tagName, textContent) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  parentElement.append(element);
  return element;
}
searchBarSetUp();
//this function collects the ready card
function createCard({ image, name, season, number, summary }) {
  const card = document.createElement("card"); //this is the card container, we will return it from this function
  const img = document.createElement("img");
  img.src = image.medium;
  card.append(img);
  createChildElement(card, "h3", name);
  createChildElement(
    card,
    "p",
    `S${season.toString().padStart(2, "0")}E${number.toString().padStart(2, "0")}`,
  );
  createChildElement(
    card,
    "p",
    `Summary: ${summary.slice(3, summary.length - 4)}`,
  );
  return card;
}

function selectEpisodes() {
  let selectedEpisode = document.getElementById("selectedEpisode");
  selectedEpisode.innerHTML = ""; // Clear existing options
  // add "All Episodes" option
  let allOption = document.createElement("option");
  allOption.text = "All Episodes";
  allOption.value = "all";
  selectedEpisode.add(allOption);

  for (const episode of allEpisodes) {
    const { name, season, number } = episode;

    let episodeAdd = document.createElement("option");
    episodeAdd.text = `S${season.toString().padStart(2, "0")}E${number
      .toString()
      .padStart(2, "0")} - ${name}`;
    episodeAdd.value = name;

    selectedEpisode.add(episodeAdd);
  }
}

// fillters by drop down and renders the page
function selectedEpisodeFiltered() {
  const selectedEpisode = document.getElementById("selectedEpisode");

  selectedEpisode.addEventListener("change", () => {
    const ep = selectedEpisode.value;

    if (ep === "all") {
      makePageForEpisodes(allEpisodes);
      episodeCountFromSearch.innerHTML = `${allEpisodes.length} Episodes`;
      return;
    }

    const filtered = allEpisodes.filter((episode) => {
      return episode.name === ep;
    });

    makePageForEpisodes(filtered);
    episodeCountFromSearch.innerHTML = `1 Episode`;
  });
}

function makePageForEpisodes(episodeList) {
  while (rootElem.firstChild) {
    rootElem.removeChild(rootElem.firstChild);
  }
  //removes the first child of the root element, which is the default text "Select an episode to see more details." This is done to clear the page before adding new cards.
  for (const episode of episodeList) {
    //calling the function to create a card and appending the card to the end of the root tag
    rootElem.append(createCard(episode));
  }
}

function selectShowRender() {
  const selectedShow = document.getElementById("selectedShow");
  selectedShow.addEventListener("change", () => {
    id = selectedShow.value;
    loadData(`https://api.tvmaze.com/shows/${id}/episodes`);
    selectedEpisodeFiltered();
  });
}

window.onload = setup;

//p.s. Apologies if my comments are perhaps a bit too detailed. I need them for the time being.
