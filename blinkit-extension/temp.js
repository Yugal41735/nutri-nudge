// Assuming `analysisData.analysis` is the raw JSON string
let rawAnalysis = `json { "nutritional_analysis": { "high_nutrients": [ "Sodium", "Sugar" ], "low_nutrients": [] }, "processed": "Minimally processed", "nutrient_deficit": "May be deficient in vitamins and minerals", "harmful_ingredients": [], "suitable_for_diabetes": "Not suitable for people with diabetes", "allergens": { "garlic": true }, "vegetarian": true }`;

// Removing 'json ' prefix to convert it into a valid JSON string
rawAnalysis = rawAnalysis.replace(/^json\s*/, '').trim();

// Parse the raw JSON to JavaScript object
let analysis;
try {
    analysis = JSON.parse(rawAnalysis);
} catch (error) {
    console.error("Error parsing analysis data:", error);
    return;
}

// Create HTML elements to format the output
let formattedOutput = `
    <h4>AI Analysis (Gemini)</h4>
    <strong>Nutritional Analysis:</strong>
    <ul>
        <li><strong>High in:</strong> ${analysis.nutritional_analysis.high_nutrients.length > 0 
            ? analysis.nutritional_analysis.high_nutrients.map(nutrient => `<span class="badge high-nutrient">${nutrient}</span>`).join(', ') 
            : 'None'}</li>
        <li><strong>Low in:</strong> ${analysis.nutritional_analysis.low_nutrients.length > 0 
            ? analysis.nutritional_analysis.low_nutrients.map(nutrient => `<span class="badge low-nutrient">${nutrient}</span>`).join(', ') 
            : 'None'}</li>
    </ul>

    <p><strong>Processing Level:</strong> <span class="processed">${analysis.processed}</span></p>

    <p><strong>Nutrient Deficit:</strong> <span class="nutrient-deficit">${analysis.nutrient_deficit}</span></p>

    <p><strong>Harmful Ingredients:</strong> ${analysis.harmful_ingredients.length > 0 
        ? analysis.harmful_ingredients.map(ingredient => `<span class="badge harmful-ingredient">${ingredient}</span>`).join(', ') 
        : 'None identified'}</p>

    <strong>Diet Suitability:</strong>
    <ul>
        <li><strong>Diabetes:</strong> ${analysis.suitable_for_diabetes.includes("Not suitable") 
            ? `<span class="not-suitable">❌ ${analysis.suitable_for_diabetes}</span>` 
            : `<span class="suitable">✔ ${analysis.suitable_for_diabetes}</span>`}</li>
        <li><strong>Allergens:</strong> ${Object.keys(analysis.allergens).length > 0 
            ? Object.entries(analysis.allergens).map(([allergen, present]) => present 
                ? `⚠️ Contains ${allergen}` 
                : `✔ Free from ${allergen}`).join('<br>') 
            : 'No allergens specified'}</li>
        <li><strong>Vegetarian:</strong> ${analysis.vegetarian 
            ? `<span class="suitable">✔ Suitable for vegetarians</span>` 
            : `<span class="not-suitable">❌ Not suitable for vegetarians</span>`}</li>
    </ul>
`;

// Add this formatted output to some container in your HTML
console.log(formattedOutput);

// You can use the following JavaScript code to dynamically add this HTML to your webpage:
const container = document.createElement('div');
container.innerHTML = formattedOutput;
document.body.appendChild(container);
