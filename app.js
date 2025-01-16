require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

// Middleware to serve static files
app.use(express.static("public"));

// Set EJS as the template engine
app.set("view engine", "ejs");

// Function to fetch news for a specific category
const fetchNews = async (category) => {
    const url = `https://api.thenewsapi.com/v1/news/top?api_token=${process.env.NEWS_API_TOKEN}&locale=in&limit=3&categories=${category}`;

  try {
    const { data } = await axios.get(url);

    // Assuming the articles are in `data.data`
    const articles = data.data.map((article) => ({
      title: article.title,
      imageUrl: article.image_url,
      summary: article.description,
      sourceUrl: article.url,
      publishedAt: article.published_at,
    }));

    return articles;
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error.message);
    return [];
  }
};

// Route for homepage
app.get("/", async (req, res) => {
  const categories = ["science", "sports", "tech", "business"];
  const newsData = {};

  for (const category of categories) {
    newsData[category] = await fetchNews(category);
  }
  
  res.render("index", { newsData });
});

// Route to fetch news dynamically
app.get("/fetch-news", async (req, res) => {
    const category = req.query.category; // Read category from the query string
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
  
    try {
      const articles = await fetchNews(category);
      res.json({ success: true, articles });
      console.log(articles);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
