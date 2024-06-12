window.onload = async () => {
    const response = await fetch("https://servicodados.ibge.gov.br/api/v3/noticias?qtd=10");
    const json = await response.json();
    
    const filterIcon = document.querySelector(".filter-icon");
    filterIcon.addEventListener("click", () => {
        const dialog = document.querySelector(".filter-dialog");
        dialog.showModal();
    })

    const main = document.querySelector("main");

    for (let news of json.items) {
        const paragraphElement = document.createElement("p");
        paragraphElement.textContent = news.titulo;
        main.appendChild(paragraphElement);
    }
}