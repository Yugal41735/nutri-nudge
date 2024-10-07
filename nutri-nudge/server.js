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

    // console.log(nutriscoreGrade);
    // console.log(nutrients);
    // console.log(ingredients);

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
    prompt += "answer following questions in structured format and in json format\n\njson structure should be in below format:\n\n{\n  \"nutritional_analysis\": {\n    \"high_in\": \"Sodium,\n\"low_in\": \"calories, fat\"\n},\n    \"processed\": \"Minimally processed\",\n    \"nutrient_deficit\": \"May be deficient in vitamins and minerals, depending on the specific preparation method.\",\n    \"harmful_ingredients\": {},\n  \"suitable_for_diabetes\": \"Not recommended for people with diabetes due to the high sugar content.\",\n  \"allergens\": { \"Garlic\" : \"Yes\"\n  },\n\"Vegetarian\" : \"Yes\n}\n``` \n\nAbove is just an example, modify it based on ingridients or nutrietents mentioned\nNo need of explanation\nThe things that are mentioned in above example, if it is not mentioned in input, dont include them"

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
