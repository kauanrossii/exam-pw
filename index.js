let currentPage = 1;
let currentQuantity = 10;
let currentStartDate;
let currentLastDate;

window.onload = async () => {
    const searchParams = new URLSearchParams(document.location.search);
    const apiUrl = "https://servicodados.ibge.gov.br/api/v3/noticias";

    const response = await fetch(apiUrl + '?' + searchParams.toString());
    const json = await response.json();

    const newsListElement = document.querySelector(".list-news");
    
    json.items.forEach(async (news) => {
        const newsItemElement = await createNewsItem(news);
        newsListElement.appendChild(newsItemElement);
        newsListElement.appendChild(document.createElement('br'))
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
                <span>#${news.editorias}</span>
                <span>${newsDateString}</span>
            </div>
            <a class="link-news-details" href="${news.link}">
                <button type="button">Leia mais</button> 
            </a>
        </div>
    `;
    return newsItemElement;
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
        // const { key, value } = data;
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