// server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const getProductDetails = require('./openFoodFacts');

const app = express();
const PORT = 3000;
const apiKey = process.env.API_KEY; // Replace with your actual gemini api key
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
  responseMimeType: "application/json",
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
    // console.log(userPreferences.dietPlan);



    // Build prompt with user preferences
    let prompt = `Based on the given nutrient information or ingredients, provide a structured analysis for the following questions:\n\n1. Nutritional Analysis - Identify nutrients that are present in higher quantities than desired (e.g., fats, sugar, sodium, calories) and those that are in lower quantities.\n2. Processing Level - Describe how processed the product is from the ingredient and nutritional information present in input and whether it may lack essential nutrients.\n3. Harmful Ingredients - List any potentially harmful ingredients present in the input.\n`;
    prompt += `4. Nutrient Deficit - Indicate if the input may lack any essential nutrients (e.g., vitamins, minerals).\n`;
    if (userPreferences) {
      if (userPreferences.allergies) {
        prompt += `{\"allergens\" {}} // Mention whether elements mentioned ${userPreferences.allergies} are present in ingridient provided in input or not. Answer in yes or no`;
        prompt += `\n Dont mention any other elements other than ${userPreferences.allergies} in allergens`;
      }
      if (userPreferences.dietPlan && userPreferences.dietPlan !== 'none') {
        prompt += `6. ${userPreferences.dietPlan} - Determine if the product is suitable for a ${userPreferences.dietPlan} diet from the ingredient or nutritional information present in input. Answer in yes or no\n`;
      }
      if (userPreferences.diabetes) {
        prompt += `7. suitable_for_diabetes - Determine if the product is suitable for someone with diabetes from the information given in input. Answer in yes or no`;
      }
    }
    prompt += `\nPlease provide the answers in the following structured JSON format:\n\n{\n  \"nutritional_analysis\": {\n    \"high_in\": [\"sodium\", \"sugar\"],  // List nutrients present in high quantities\n    \"low_in\": [\"fiber\"]             // List nutrients present in low quantities\n  },\n  \"processed\": \"Highly processed\",   // Describe processing level\n  \"nutrient_deficit\": \"May be deficient in vitamins and minerals\", // Describe nutrient deficits, if any\n \"harmful_ingredients\": {           // List harmful ingredients, if any\n    \"Additives\": \"E150d (Caramel Color)\"\n  },\n  },\n}\n\nNotes:\nInclude or exclude fields dynamically based on the user’s input.\nIf a specific question isn't asked, do not include it in the final JSON response.\nThe response will maintain a structured JSON format for easy parsing.`;

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
