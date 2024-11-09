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

// console.log(apiKey);

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


app.get("/", (req, res) => res.send("Express on Vercel"));
app.get("/apiKey", (req, res) => res.send(apiKey));


// Route to handle product details
app.post('/productDetail', async (req, res) => {
  try {
    const { productName } = req.body;

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

    const result = {
      ingredients: ingredients,
      nutrients: nutrients,
      nutriscoreGrade: nutriscoreGrade
    };

    res.json(result);
  } catch (error) {
    console.error("Error analyzing data:", error);
    res.status(500).json({ error: "Error analyzing data" });
  }
});

// Route to handle product name
app.post('/refactor', async (req, res) => {
  try {
    const { productName } = req.body;


    let input = productName;

    // Build prompt with user preferences
    let prompt = `Extract product name from the input, and remove any unnecessary details like its weight or any other other details from the product name.\n{\"product_name\": }`;

    const parts = [
      { text: prompt },
      { text: `input: ${input}\n\n` },
      { text: "output: " },
    ];

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
    });
    

    // console.log(result.response.text());

    res.json({ analysis: result.response.text() });
  } catch (error) {
    console.error("Error analyzing data:", error);
    res.status(500).json({ error: "Error analyzing data" });
  }
});

// Route to handle Gemini analysis
app.post('/analyze', async (req, res) => {
  try {
    const { productName, ingredientsOrNutrition, ingredientsAPI, nutrientsAPI, userPreferences } = req.body;


    let ingredients = ingredientsAPI;
    let nutrients = nutrientsAPI;

    // console.log(nutrients);
    // console.log(ingredients);

    let input = 'Product Name: ' + productName + '\n';

    if(ingredients == "Ingredients not available" || nutrients == "Nutritional information not available" || Object.keys(nutrients).length === 0) {
      input += ingredientsOrNutrition;
    } else {
      input += 'Ingredients: '+ ingredients + "\n\n" + 'Nutrients: ' + nutrients;
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
      if (userPreferences.dietPlan && userPreferences.dietPlan.toLowerCase() !== 'none') {
        prompt += `\n6. ${userPreferences.dietPlan} - Determine if the product is suitable for a ${userPreferences.dietPlan} diet from the ingredient or nutritional information present in input. Answer in yes or no\n`;
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

    let parsed_result;
    try {
      parsed_result = JSON.parse(result.response.text());
    } catch(error) {
      console.error("Error parsing Gemini response:", error);
      return res.status(500).json({ error: "Failed to parse Gemini response." });
    }

    const suitableForDiabetes = parsed_result.suitable_for_diabetes;
    const allergens = parsed_result.allergens || {};
    const dietPlanSuitability = parsed_result[userPreferences.dietPlan];

    let hasAllergens;

    if(allergens) {
      hasAllergens = Object.values(allergens).some(value => value.toLowerCase() === "yes");
    }

    // console.log(hasAllergens);
    // console.log(suitableForDiabetes);
    // console.log(dietPlanSuitability);

    let alternative_prompt = '';

    if(hasAllergens || (suitableForDiabetes && suitableForDiabetes.toLowerCase() === "no") || (dietPlanSuitability && dietPlanSuitability.toLowerCase() === "no")) {
      alternative_prompt += `\n8. If any of the following conditions are met, suggest alternative products that may be better suited for the user:\n`;
    
      if(hasAllergens) {
        alternative_prompt += ` - ${productName} contains allergens that the user is sensitive to. Recommend an alternative product which does not contain allergens: ${userPreferences.allergies}\n`;
      }
      if(dietPlanSuitability && dietPlanSuitability.toLowerCase() === "no") {
        alternative_prompt += `- ${productName} is not suitable for people with ${userPreferences.dietPlan} diet plan. Suggest a compliant alternative from a similar category\n`;
      }
      if(suitableForDiabetes && suitableForDiabetes.toLowerCase() === "no") {
        alternative_prompt += `- ${productName} is not suitable for people with diabetes. Recommend a sugar free alternative.\n`;
      }
      alternative_prompt += `{\"alternative_recommendation\" : {\"product_name\": } } // Mention alternatives in this format\n`;
      // alternative_prompt += `Keep reason short.`;
    }

    const alternative_parts = [
      { text: alternative_prompt },
      { text: `input: ${input}\n\n` },
      { text: "output: " },
    ];

    const alternative_result = await model.generateContent({
      contents: [{role: "user", parts: alternative_parts}],
      generationConfig,
    });

    let alternative_text = alternative_result.response.text();

    if(alternative_prompt.length == 0) {
      alternative_text = '{}';
    }

    // console.log(alternative_result.response.text());

    res.json({ analysis: result.response.text() + '*' + alternative_text });
  } catch (error) {
    console.error("Error analyzing data:", error);
    res.status(500).json({ error: "Error analyzing data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app
