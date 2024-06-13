window.onload = async () => {
    const response = await fetch("https://servicodados.ibge.gov.br/api/v3/noticias?qtd=10");
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
    console.log(imagesCollection)
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