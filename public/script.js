document.addEventListener("DOMContentLoaded", () => {
  const getNewsButtons = document.querySelectorAll(".get-news-btn");

  // Fetch updated news when "Get News" button is clicked
  getNewsButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const category = button.getAttribute("data-category");
      const articlesContainer = document.getElementById(`${category}-articles`);

      // Show loading message
      articlesContainer.innerHTML = "<p>Loading...</p>";

      try {
        // Fetch updated news from the server
        const response = await fetch(`/fetch-news?category=${category}`);
        const data = await response.json();

        if (data.success) {
          const articles = data.articles;

          // Replace articles with updated news
          articlesContainer.innerHTML = articles
            .map(
              (article, index) => `
              <div class="article ${index > 0 ? "hidden" : ""}">
                <div class="card">
                  <img
                    src="${article.imageUrl}"
                    class="card-img-top"
                    alt="Article Image"
                  />
                  <div class="card-body">
                    <h5 class="card-title">${article.title}</h5>
                    <p class="card-text">${article.summary}</p>
                    <a href="${article.sourceUrl}" class="btn btn-info" target="_blank">Read More</a>
                  </div>
                </div>
              </div>
            `
            )
            .join("");
        } else {
          articlesContainer.innerHTML = `<p>Error fetching news: ${data.error}</p>`;
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        articlesContainer.innerHTML = "<p>Error loading news articles.</p>";
      }
    });
  });

  // Handle scrolling when the down-arrow button is clicked
  const arrowButtons = document.querySelectorAll(".down-arrow");

  arrowButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");
      const articlesContainer = document.getElementById(`${category}-articles`);
      const hiddenArticles = articlesContainer.querySelectorAll(".article.hidden");

      if (hiddenArticles.length > 0) {
        // Show the next hidden article
        hiddenArticles[0].classList.remove("hidden");
        hiddenArticles[0].scrollIntoView({ behavior: "smooth" });
      } else {
        console.log("No more articles to show.");
      }
    });
  });
});
