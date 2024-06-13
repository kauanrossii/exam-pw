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
}

async function createNewsItem(news) {
    const imagesCollection = await JSON.parse(news.imagens);
    const newsItemElement = document.createElement("li");
    newsItemElement.innerHTML = `
        <img class="news-image" src="https://agenciadenoticias.ibge.gov.br/${imagesCollection.image_intro}">
        <div class="container-news-content">
            <h2>${news.titulo}</h2>
            <p>${news.introducao}</p>
            <div class="container-news-tags">
                <span>#${news.editorias}</span>
                <span>${news.data_publicacao}</span>
            </div>
            <a class="link-news-details" href="${news.link}">
                <button type="button">Leia mais</button> 
            </a>
        </div>
    `;
    return newsItemElement;
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
        console.log(key, value);
        if (data[1] != "" && data[1] != "none") {
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