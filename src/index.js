import ImagesApiService from "./js/imagesService";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";

const refs = {
  searchForm: document.querySelector(".search-form"),
  gallery: document.querySelector(".gallery"),
  loadMoreBtn: document.querySelector(".load-more"),
}
const imagesApiService = new ImagesApiService();
const simplelightbox = new SimpleLightbox(".gallery a");

refs.searchForm.addEventListener("submit", onSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMore);

function onSubmit(e) {
  e.preventDefault();
  clearContent();
  refs.loadMoreBtn.classList.add("load-more--unvisible");

  imagesApiService.resetPage();
  imagesApiService.searchQuery = e.target.searchQuery.value.trim();
  imagesApiService.fetchImages()
    .then(photoCards => {
      if (photoCards.hits.length === 0) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
    } else {
        Notify.success(`Hooray! We found ${photoCards.totalHits} images.`);
        refs.loadMoreBtn.classList.remove("load-more--unvisible");
        innerContent(photoCards);
        simplelightbox.refresh();
      }
      checkGallerysEnd();
    });
}

function onLoadMore() {
  imagesApiService.fetchImages()
    .then(photoCards => {
      checkGallerysEnd();
      innerContent(photoCards);
      smoothScroll();
      simplelightbox.refresh();
    });
}


function createPhotoCard(card) {
  return `<div class="photo-card">
  <a class="gallery__item" href="${card.largeImageURL}">
  <img class="gallery__image" src="${card.webformatURL}" alt="${card.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${card.likes}
      </p>
      <p class="info-item">
      <b>Views</b>
      ${card.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${card.comments}
    </p>
    <p class="info-item">
    <b>Downloads</b>
      ${card.downloads}
    </p>
    </div>
</div>`
}

function generateContent(photoCards) {
    return photoCards.reduce((acc, card) => { return acc + createPhotoCard(card) }, '');
}

function innerContent(photoCards) {
  const content = generateContent(photoCards.hits);
  refs.gallery.insertAdjacentHTML("beforeend", content);
}

function clearContent() {
    refs.gallery.innerHTML = '';
}

function checkGallerysEnd() {
  if (imagesApiService.isGallerysEnd) {
    refs.loadMoreBtn.classList.add("load-more--unvisible");
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
  .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
    
    window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
