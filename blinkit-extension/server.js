// server.js

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const getProductDetails = require('./openFoodFacts');

const app = express();
const PORT = 3000;
const apiKey = 'AIzaSyDZHo7J7uLU7WMmRqLwlk5bol8SRXwXlbY';  // Replace with your actual API key
const genAI = new GoogleGenerativeAI(apiKey);

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Route to handle Gemini analysis
app.post('/analyze', async (req, res) => {
  try {
    const { productName, ingredientsOrNutrition, userPreferences } = req.body;

    let ingredients, nutrients, nutriscoreGrade;

    try{
      const productDetails = await getProductDetails(productName);
      ingredients = productDetails.ingredients;
      nutrients = JSON.stringify(productDetails.nutrients);
      nutriscoreGrade = productDetails.nutriscoreGrade;
    } catch(error) {
      console.error("Error retrieving product from OpenFoodFacts:", error);
      console.error("Falling back to extracted data as product not found in OpenFoodFacts.");
      ingredients = "Ingredients not available";
      nutrients = "Nutritional information not available";
    }

    let input;

    if(ingredients == "Ingredients not available" || nutrients == "Nutritional information not available" || Object.keys(nutrients).length === 0) {
      input = ingredientsOrNutrition;
    } else {
      input = ingredients + "\n\n" + nutrients;
    }

    // console.log("Input for Gemini Model:", input);



    // Build prompt with user preferences
    let prompt = `Based on the given nutrient information or ingredients, answer the following question:\n`;
    prompt += `Nutritional Analysis - Higher presence of nutrients desired in low qty (fats, sugar, sodium, calories)\n`;
    prompt += `How processed and nutrient deficit is the product?\nHarmful Ingredients present\n`;

    // Add user preferences to the prompt for personalized analysis
    if (userPreferences) {
      if (userPreferences.diabetes) {
        prompt += `Does this product suit someone with diabetes?\n`;
      }
      if (userPreferences.allergies) {
        prompt += `Does this product contain any of the following allergens: ${userPreferences.allergies}?\n`;
      }
      if (userPreferences.dietPlan && userPreferences.dietPlan !== 'none') {
        prompt += `Is this product suitable for a ${userPreferences.dietPlan} diet?\n`;
      }
    }

    prompt += `\nProvide the answers in a structured JSON format.\n`;

    const parts = [
      { text: prompt },
      { text: `input: ${input}\n\n` },
      { text: "output: " },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });

    res.json({ analysis: result.response.text() });
  } catch (error) {
    console.error("Error analyzing data:", error);
    res.status(500).json({ error: "Error analyzing data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
