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
            const span = nestedContainer.querySelectorAll('div p span');

            for (let i = 0; i < span.length; i++) {
                const labelSpan = span[i];

                if (labelSpan && labelSpan.textContent.includes('Ingredients')) {
                    console.log(labelSpan.textContent);
                    const pElement = labelSpan.parentElement;
                    const nextDivElement = pElement.nextElementSibling;

                    if(nextDivElement && nextDivElement.tagName.toLowerCase() === 'div') {
                        console.log(nextDivElement.textContent);
                        productIngredients = nextDivElement.textContent.trim();
                    }
                    
                }

                if (labelSpan && labelSpan.textContent.includes('Nutrition Information')) {
                    console.log(labelSpan.textContent);
                    const pElement = labelSpan.parentElement;
                    const nextDivElement = pElement.nextElementSibling;

                    if(nextDivElement && nextDivElement.tagName.toLowerCase() === 'div') {
                        console.log(nextDivElement.textContent);
                        productNutrition = nextDivElement.textContent.trim();
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
