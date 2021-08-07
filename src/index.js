import "./styles.css";

let storage = [];
const post = document.querySelector(".post");
const loader = document.querySelector(".loader");
const homenav = document.getElementById("homenav");
const favnav = document.getElementById("favnav");
const container = document.querySelector(".container");
const leftsider = container.querySelector(".left-sider");
const rightsider = container.querySelector(".right-sider");
const homebtn = document.querySelector(".homebtn");
const favhomebtn = document.querySelector(".favhomebtn");
const favbtn = document.querySelector(".favbtn");
const added = document.querySelector(".card-added");
let date = new Date();
let enddate = date.toISOString().slice(0, 10);
let start = date.getDate() - 6;
let predate = new Date(date.setDate(start));
let startdate = predate.toISOString().slice(0, 10);
let apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&start_date=${startdate}&end_date=${enddate}`;
let favStorage = {};

function saveFav(resultUrl) {
  storage.forEach((result) => {
    if (result.url.includes(resultUrl) && !favStorage[resultUrl]) {
      favStorage[resultUrl] = result;
      localStorage.setItem("favposts", JSON.stringify(favStorage));
      added.classList.remove("hidden");
      setTimeout(() => {
        added.classList.add("hidden");
      }, 3000);
    }
  });
}
function removeFav(resultUrl) {
  if (favStorage[resultUrl]) {
    delete favStorage[resultUrl];
    localStorage.setItem("favposts", JSON.stringify(favStorage));
    renderData("fav");
  }
}

function createDOM(data) {
  console.log(data);
  const renderdata = data === "storage" ? storage : Object.values(favStorage);
  renderdata.forEach((d) => {
    //   Card
    const card = document.createElement("div");
    card.classList.add("card");

    // Link
    const link = document.createElement("a");
    link.href = d.hdurl;
    link.target = "_blank";
    link.title = "View Full Image";

    // img
    const img = document.createElement("img");
    img.src = d.url;
    img.alt = "Space Image";
    img.classList.add("card-img");

    // card-body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Title
    const cardTitle = document.createElement("h3");
    cardTitle.classList.add("card-title");
    cardTitle.innerText = d.title;

    // Favourite
    const favourite = document.createElement("p");
    favourite.classList.add("fav", "clickable");
    if (data === "storage") {
      favourite.innerText = "Add To Favourite";
      favourite.addEventListener("click", function () {
        saveFav(`${d.url}`);
        console.log(d.url);
      });
    } else {
      favourite.innerText = "Remove Favourite";
      favourite.addEventListener("click", function () {
        removeFav(`${d.url}`);
      });
    }

    // Explaination
    const explanation = document.createElement("p");
    explanation.innerText = d.explanation;
    explanation.classList.add("expalain");

    // Footer
    const footer = document.createElement("small");
    footer.innerHTML = `<strong>${d.date}</strong>  <span>${d.copyright}</span>`;

    cardBody.append(cardTitle, favourite, explanation, footer);
    link.append(img);
    card.append(link, cardBody);
    post.append(card);
  });
}

function changeNav(data) {
  if (data === "storage") {
    homenav.style.display = "";
    favnav.style.display = "none";
  } else {
    homenav.style.display = "none";
    favnav.style.display = "";
  }
}
function renderData(data) {
  if (localStorage.getItem("favposts")) {
    favStorage = JSON.parse(localStorage.getItem("favposts"));
  }
  post.innerHTML = "";
  createDOM(data);
  changeNav(data);
  loadingcomplete();
}
async function getData() {
  loading();
  try {
    let data = await fetch(apiUrl);
    storage = await data.json();
    renderData("storage");
  } catch (error) {
    console.log("error", error);
  }
}

function loading() {
  loader.classList.remove("hidden");
  container.classList.add("hidden");
  leftsider.style.display = "none";
  rightsider.style.display = "none";
}

function loadingcomplete() {
  loader.classList.add("hidden");
  container.classList.remove("hidden");
  leftsider.style.display = "";
  rightsider.style.display = "";
}

function init() {
  homebtn.addEventListener("click", getData);
  favhomebtn.addEventListener("click", getData);
  favbtn.addEventListener("click", function () {
    renderData("fav");
  });
  getData();
}

init();
