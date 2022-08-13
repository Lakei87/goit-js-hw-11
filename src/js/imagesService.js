import axios from "axios";

const API_KEY = "29164784-c09cfa926a0283a5bc80e82cc";
const BASE_URL = "https://pixabay.com/api/";
const perPageParam = 40;
const searchParameters = `image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPageParam}`

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
        this.totalPages = 0;
    }
    
    async fetchImages() {
        const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${searchParameters}&page=${this.page}`;
        try {
            const response = await axios.get(url);
            this.totalPages = Math.ceil(response.data.totalHits / perPageParam);
            this.incrementPage();
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

    get isGallerysEnd() {
        return (this.totalPages < this.page) ? true : false;
    }
}