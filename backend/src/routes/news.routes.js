const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/mauritius", async (req, res) => {
  try {
    const url =
      `https://newsapi.org/v2/everything?q=Mauritius OR travel OR tourism&language=en&pageSize=10&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await axios.get(url);

    res.json(response.data);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch news",
    });

  }
});

module.exports = router;