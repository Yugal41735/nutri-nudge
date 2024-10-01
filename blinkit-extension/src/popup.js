// src/popup.js

document.getElementById('extract-button').addEventListener('click', () => {
    // Collect user preferences
    const diabetes = document.getElementById('diabetes').checked;
    const allergies = document.getElementById('allergies').value.trim();
    const dietPlan = document.getElementById('diet-plan').value;

    // Show a loading message while waiting for the backend response
    document.getElementById('loading-message').style.display = 'block';

    // Query the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractProductInfo" }, async (response) => {
            if (response) {
                let ingredientsOrNutrition = response.productIngredients || response.productNutrition;
                let productName = response.productName;

                if (ingredientsOrNutrition) {
                    try {
                        // Prepare the data to be sent to the backend, including user preferences
                        const requestData = {
                            productName,
                            ingredientsOrNutrition,
                            userPreferences: {
                                diabetes,
                                allergies,
                                dietPlan
                            }
                        };

                        // Send the data to the backend for analysis
                        const analysisResponse = await fetch('http://localhost:3000/analyze', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestData)
                        });

                        // Check if the response is okay
                        if (!analysisResponse.ok) {
                            throw new Error(`Server responded with status ${analysisResponse.status}`);
                        }

                        const analysisData = await analysisResponse.json();

                        // Print the response to the console for debugging purposes
                        console.log("Analysis Response from Backend:", analysisData);

                        // Display the product info, raw analysis, and user preferences in an alert box
                        let message = `Product: ${response.productName || 'N/A'}`;
                        if (response.productIngredients) {
                            message += `\nIngredients: ${response.productIngredients}`;
                        }
                        if (response.productNutrition) {
                            message += `\nNutrition Information: ${response.productNutrition}`;
                        }

                        // Add the raw analysis from Gemini model without cleaning or formatting
                        if (analysisData.analysis) {
                            message += `\n\nGemini Analysis (Raw Output):\n${analysisData.analysis}`;
                        }

                        // Add user preferences to the output
                        message += `\n\nUser Preferences:\n`;
                        message += diabetes ? `- Has diabetes\n` : '- No diabetes\n';
                        if (allergies) {
                            message += `- Allergies: ${allergies}\n`;
                        }
                        if (dietPlan && dietPlan !== "none") {
                            message += `- Follows a ${dietPlan} diet\n`;
                        }

                        alert(message);
                    } catch (error) {
                        // Log error details to the console
                        console.error("Error processing analysis:", error);
                        alert("Error processing analysis. Check console for details.");
                    }
                } else {
                    alert("No ingredients or nutrition information found to analyze.");
                }
            } else {
                alert("Product information could not be extracted. Please try again.");
            }
        });
    });
});

// Show a loading message while waiting for the backend response
function showLoading() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-message';
    loadingElement.innerText = 'Processing... Please wait.';
    document.body.appendChild(loadingElement);
    loadingElement.style.display = 'none';
}

// Call this to add the loading message element when the page loads
showLoading();