const auth = "563492ad6f9170000100000110c71f16749a4d47bfea9ee4326862b7";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");

let page;
let searchValue;

// Event listeners
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault();
  searchPhotos(searchValue);
  clearGallery();
});
more.addEventListener("click", loadMore);

// functions
async function loadMore() {
  const data = await fetchApi(page);
  generatePics(data);
}

function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });

  const data = await dataFetch.json();
  page = data.next_page;
  return data;
}

function generatePics(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `<img src=${photo.src.large}></img>
    <div class="gallery-info">
    <a target="_blank" href=${photo.photographer_url}>${photo.photographer}</a>
    <a target="_blank" href=${photo.src.original}><i class="fas fa-download"></i></a>
    </div>
    `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  const data = await fetchApi("https://api.pexels.com/v1/curated");
  generatePics(data);
}

async function searchPhotos(query) {
  const data = await fetchApi(
    `https://api.pexels.com/v1/search?query=${query}`
  );
  generatePics(data);
}

function clearGallery() {
  gallery.innerHTML = "";
  searchInput.placeholder = searchInput.value;
  searchInput.value = "";
}
curatedPhotos();
