const allShows = [];
let activeShow = 58;

async function getAllShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");

    const data = await response.json();

    for (const show of data) {
      allShows.push(show);
    }
    selectShow();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function selectShow() {
  let selectedShow = document.getElementById("selectedShow");
  selectShow.innerHTML = ""; // Clear existing options
  for (const shows of allShows) {
    const { name, id } = shows;

    let showAdd = document.createElement("option");
    showAdd.text = `${name}`;
    showAdd.value = id;
    selectedShow.add(showAdd);
  }
}
