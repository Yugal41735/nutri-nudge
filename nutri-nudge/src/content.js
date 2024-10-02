// src/content.js

// Extract product details from the Blinkit page
function getProductDetails() {
    let productName = document.querySelector('h1')?.textContent || '';
    let productIngredients = '';
    let productNutrition = '';

    // Find the container with the class ProductDetails__ProductDetailsContainer
    const productContainer = document.querySelector('div.ProductDetails__ProductDetailsContainer-sc-z5f4ag-0.fRMVCN');

    if (productContainer) {
        const nestedContainer = productContainer.querySelector('div.ProductDetails__RemoveMaxHeight-sc-z5f4ag-3.fOPLcr');

        if (nestedContainer) {
            const divs = nestedContainer.querySelectorAll('div');

            for (let i = 0; i < divs.length; i++) {
                const labelDiv = divs[i];
                const nextDiv = divs[i + 1];

                if (labelDiv && labelDiv.textContent.includes('Ingredients')) {
                    if (nextDiv) {
                        productIngredients = nextDiv.textContent.trim();
                    }
                }

                if (labelDiv && labelDiv.textContent.includes('Nutrition Information')) {
                    if (nextDiv) {
                        productNutrition = nextDiv.textContent.trim();
                    }
                }
            }
        }
    }

    return { productName, productIngredients, productNutrition };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractProductInfo") {
        const productDetails = getProductDetails();
        sendResponse(productDetails);
    }
});
