const axios = require("axios");

async function analyzeMood(text) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer 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`,
          Accept: "application/json",
        },
      }
    );

    const emotions = response.data[0];

    const primaryEmotion = emotions.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );

    console.log(`${primaryEmotion.label}`);
    return primaryEmotion.label;
  } catch (error) {
    console.error(
      "Error analyzing mood:",
      error.response ? error.response.data : error.message
    );
  }
}

analyzeMood("leave me alone");
