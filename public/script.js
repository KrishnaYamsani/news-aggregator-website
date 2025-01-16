document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".get-news-btn");
  
    buttons.forEach((button) => {
      button.addEventListener("click", async () => {
        const category = button.getAttribute("data-category");
        const articlesContainer = document.getElementById(`${category}-articles`);
  
        // Clear existing articles
        articlesContainer.innerHTML = "<p>Loading...</p>";
  
        try {
          const response = await fetch(`/fetch-news?category=${category}`);
          const data = await response.json();
  
          if (data.success) {
            const articles = data.articles;
  
            // Render articles dynamically
            articlesContainer.innerHTML = articles
              .map(
                (article) => `
                <div class="col-md-4 mb-3">
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
  });
  