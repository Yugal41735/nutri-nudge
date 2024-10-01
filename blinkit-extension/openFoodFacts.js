const axios = require('axios');

// Function to fetch product information from OpenFoodFacts by product name, sorted by popularity
async function getProductDetails(productName) {
    try {
        const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
            params: {
                search_terms: productName,
                search_simple: 1,
                action: 'process',
                json: 1,
                sort_by: 'popularity'  // Sorting by popularity to get the most popular product
            }
        });

        // Access the products array from the response
        const products = response.data.products;

        if (products.length > 0) {
            const product = products[0];  // Select the most popular product
            const ingredients = product.ingredients_text || "Ingredients not available";
            const nutrients = product.nutriments || {};
            const nutriscoreGrade = product.nutriscore_grade || "Nutri-Score not available";

            // Logging the extracted information
            console.log(`Product: ${product.product_name}`);
            console.log(`Ingredients: ${ingredients}`);
            console.log(`Nutri-Score Grade: ${nutriscoreGrade}`);
            console.log(`Nutriments:`, nutrients);

            return {
                ingredients: ingredients,
                nutrients: nutrients,
                nutriscoreGrade: nutriscoreGrade
            };
        } else {
            console.log("Product not found.");
            return {
                ingredients: "Ingredients not available",
                nutrients: {},
                nutriscoreGrade: "Nutri-Score not available"
            };
        }

    } catch (error) {
        console.error("Error fetching product information:", error);
        throw new Error("Error fetching product information.");
    }
}

module.exports = getProductDetails;

// Call the function with the product name
// getProductDetails("Kissan Fresh Tomato Ketchup");
