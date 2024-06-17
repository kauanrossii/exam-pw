const initialPage = 1;
const initialQuantity = 10;
const initialLastDate = "";
const initialStartDate = "";
const initialType = "";

let currentPage = 1;
let currentQuantity = 10;
let currentStartDate;
let currentLastDate;
let totalPages;
let currentType;

window.onload = async () => {
    const searchParams = new URLSearchParams(document.location.search);
    const apiUrl = "https://servicodados.ibge.gov.br/api/v3/noticias";

    const response = await fetch(apiUrl + '?' + searchParams.toString());
    const json = await response.json();
    totalPages = json.totalPages;
    updateSearchByQueryString();
    updateFiltersNumberByQueryString();
    const newsListElement = document.querySelector(".list-news");

    json.items.forEach(async (news) => {
        const newsItemElement = await createNewsItem(news);
        newsListElement.appendChild(newsItemElement);
        newsListElement.appendChild(document.createElement('br'))
        insertEditorialsTags(news);
    });

    insertPaginationButtons();
}

async function createNewsItem(news) {
    const imagesCollection = await JSON.parse(news.imagens);
    const newsItemElement = document.createElement("li");
    const newsDateString = createNewsDateString(news.data_publicacao);
    newsItemElement.innerHTML = `
        <img class="news-image" src="https://agenciadenoticias.ibge.gov.br/${imagesCollection.image_intro}">
        <div class="container-news-content">
            <h2>${news.titulo}</h2>
            <p>${news.introducao}</p>
            <div class="container-news-tags">
                <div class="container-editorials" data-editorials-id="${news.id}">
                </div>
                <span>${newsDateString}</span>
            </div>
            <a class="link-news-details" href="${news.link}">
                <button type="button">Leia mais</button> 
            </a>
        </div>
    `;
    return newsItemElement;
}

function insertEditorialsTags(news) {
    const editorialsContainer = document.querySelector(`[data-editorials-id='${news.id}']`);
    const editorials = news.editorias.split(";");
    for (let i = 0; i < editorials.length; i++) {
        const spanElement = document.createElement("span");
        spanElement.textContent = "#" + editorials[i];
        editorialsContainer.appendChild(spanElement)
    }
}

function updateSearchByQueryString() {
    const filterNumberContainer = document.querySelector(".filter-number-container");
    const searchParams = new URLSearchParams(document.location.search);
    const pageParam = searchParams.get('page');
    const quantityParam = searchParams.get('qtd');
    const startDateParam = searchParams.get('de');
    const lastDateParam = searchParams.get('ate');
    const typeParam = searchParams.get('tipo');
    console.log(quantityParam);
    let quantityFilters = 0;

    if (pageParam != initialPage) {
        currentPage = Number(pageParam);
    }

    if (quantityParam && quantityParam != initialQuantity) {
        currentQuantity = Number(quantityParam);
        quantityFilters++;
    }

    if (startDateParam && startDateParam != initialStartDate) {
        currentStartDate = startDateParam;
        quantityFilters++;
    }

    if (lastDateParam && lastDateParam != initialLastDate) {
        currentLastDate = lastDateParam;
        quantityFilters++;
    }

    if (typeParam && typeParam != initialType) {
        currentType = typeParam;
        quantityFilters++;
    }

    filterNumberContainer.textContent = quantityFilters;
}

function updateFiltersNumberByQueryString() {

}

function createNewsDateString(rawDate) {
    const daysDifference = getNewsDateDifferenceInDays(rawDate);

    if (daysDifference == 0) {
        return "Publicado hoje";
    }

    if (daysDifference == 1) {
        return "Publicado ontem";
    }

    return `Publicado há ${daysDifference} dias`;
}

function getNewsDateDifferenceInDays(rawDate) {
    const rawDateObject = new Date(rawDate);
    const nowDate = new Date();
    const milisecondsDifference = nowDate - rawDateObject;
    const daysDifference = Math.floor(milisecondsDifference / (1000 * 60 * 60 * 24));
    return daysDifference;
}

function openDialog() {
    const dialog = document.querySelector(".filter-dialog");
    dialog.showModal();
}

function closeDialog() {
    const dialog = document.querySelector(".filter-dialog");
    dialog.close();
}

function applyFilters(event) {
    event.preventDefault();
    const formElement = document.querySelector(".filter-form");
    const formData = new FormData(formElement);
    let urlParams = new URLSearchParams(window.location.search);

    for (let data of formData.entries()) {
        if (data[1] != "none") {
            urlParams.set(data[0], data[1]);
        }
    }

    window.location.search = urlParams.toString();
}

function filterNewsByTitle(event) {
    event.preventDefault();
    const searchInput = document.querySelector(".search-bar-input");
    let urlParams = new URLSearchParams(window.location.search);
    urlParams.set('busca', searchInput.value);
    window.location.search = urlParams.toString();
}

function insertPaginationButtons() {
    const pageList = document.querySelector(".list-pages");
    insertGoBackButton(pageList);
    insertPageButtons(pageList);
    insertGoForwardButton(pageList);
}

function insertGoBackButton(pageList) {
    const listItem = createListItemButton('<');
    pageList.appendChild(listItem);
}

function insertGoForwardButton(pageList) {
    const listItem = createListItemButton('>');
    pageList.appendChild(listItem);
}

function createListItemButton(content) {
    const buttonElement = document.createElement("button");
    buttonElement.textContent = content;
    if (content == currentPage) {
        buttonElement.dataset.current = true;
    }
    buttonElement.addEventListener("click", (e) => setCurrentPageAccordingPageButton(e));
    const listItemElement = document.createElement("li");
    listItemElement.appendChild(buttonElement);
    return listItemElement;
}

function insertPageButtons(pageList) {
    const maxVisiblePages = 10;
    const pagesBegin = currentPage > 6 ? currentPage - 5 : 1;
    const pagesFinal = Math.min(pagesBegin + maxVisiblePages - 1, totalPages);

    for (let i = pagesBegin; i <= pagesFinal; i++) {
        const listItem = createListItemButton(i);
        pageList.appendChild(listItem);
    }
}

function setCurrentPageAccordingPageButton(e) {
    const buttonContent = e.target.textContent;
    if (buttonContent == `<`) {
        currentPage--;
    } else if (buttonContent == '>') {
        currentPage++;
    } else {
        currentPage = buttonContent; 
    }
    const searchParams = new URLSearchParams(document.location.search);
    searchParams.set('page', currentPage.toString());
    window.location.search = searchParams.toString();
}