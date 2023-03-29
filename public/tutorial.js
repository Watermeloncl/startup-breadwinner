/**
  https://github.com/lukePeavey/quotable
 */
function displayQuote(data) {
    const quoteBox = document.querySelector("#quoteBox");
  
    const quote = document.querySelector("#quote");
    //const quote = document.createElement("p");
    const author = document.createElement("p");
    //quote.id = "quote";
    //quote.style.margin = 0;
    //quote.style.padding = 0;
    author.id = "author";
    author.style.margin = 0;
    author.style.padding = 0;
  
    quote.textContent = data.content;
    author.textContent = "~" + data.author;

    //quoteBox.appendChild(quote);
    quoteBox.appendChild(author);
}

function callService(url, displayCallback) {
    const quote = document.createElement("p");
    quote.id = "quote";
    quote.style.margin = 0;
    quote.style.padding = 0;
    quote.textContent = "Loading...";
    document.querySelector("#quoteBox").appendChild(quote);

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            displayCallback(data);
        });
}

callService("https://api.quotable.io/random", displayQuote);