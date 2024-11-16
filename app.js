const express = require("express");
const ejs = require("ejs");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const axios = require("axios");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

dotenv.config();

async function analyzeMood(text) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.access}`,
          Accept: "application/json",
        },
      }
    );

    const emotions = response.data;

    // const primaryEmotion = emotions.reduce((prev, current) =>
    //   prev.score > current.score ? prev : current

    return emotions;
  } catch (error) {
    console.error(
      "Error analyzing mood:",
      error.response ? error.response.data : error.message
    );
  }
}

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/analyze-mood", async (req, res) => {
  try {
    const text = req.body.text;
    const moodResponse = await analyzeMood(text);

    // Extract the inner array with emotion data
    const mood =
      Array.isArray(moodResponse) && Array.isArray(moodResponse[0])
        ? moodResponse[0]
        : [];
    console.log(mood);
    if (mood.length === 0) {
      throw new Error("Mood analysis returned an empty result");
    }

    res.render("index", {
      mood: mood,
      error: null,
      originalText: text,
    });
  } catch (error) {
    console.error("Error:", error);
    res.render("index", {
      mood: null,
      error: "Failed to analyze mood. Please try again.",
      originalText: req.body.text,
    });
  }
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000 {http://localhost:3000}`);
});
