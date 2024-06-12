window.onload = async () => {
    const response = await fetch("https://servicodados.ibge.gov.br/api/v3/noticias?qtd=10");
    const json = await response.json();

    const newsListElement = document.querySelector(".list-news");
    
    json.items.forEach(news => {
        const newsItemElement = createNewsItem(news);
        newsListElement.appendChild(newsItemElement);
    });
}

function createNewsItem(news) {    
    const newsItemElement = document.createElement("li");
    newsItemElement.innerHTML = `
        <div class="container-news-image">

        </div>
        <div class="container-news-content">
            <h2>${news.titulo}</h2>
            <p>${news.introducao}</p>
            <div class="container-news-tags">
                <span>#${news.editorias}</span>
                <span>${news.data_publicacao}</span>
            </div>
            <a class="link-news-details" href="${news.link}">Leia mais</a>
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