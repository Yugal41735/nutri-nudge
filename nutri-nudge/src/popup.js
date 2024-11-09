document.getElementById('extract-button').addEventListener('click', () => {
    // Collect user preferences
    const diabetes = document.getElementById('diabetes').checked;
    const allergies = document.getElementById('allergies').value.trim();
    const dietPlan = document.getElementById('diet-plan').value;

    // Show a loading message while waiting for the backend response
    const loadingElement = document.getElementById('loading-message');
    loadingElement.style.display = 'block';

    // Query the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extractProductInfo" }, async (response) => {
            if (response) {
                if(response.productIngredients) {
                    response.productIngredients = 'Ingredients : ' + response.productIngredients + '\n';
                }
                if(response.productNutrition) {
                    response.productNutrition = 'Nutrition : ' + response.productNutrition + '\n';
                }
                let ingredientsWebsite = response.productIngredients || ''
                let nutritionWebsite = response.productNutrition || ''
                let ingredientsOrNutrition = response.productIngredients || response.productNutrition;
                let productName = response.productName;

                let ingredientsAPI, nutrientsAPI, nutriscoreGradeAPI;

                let message = ``;

                try {
                    const requestedData = {
                        productName
                    }

                    const productResponse = await fetch('https://nutri-nudge.vercel.app/refactor', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestedData)

                    });

                    if (!productResponse.ok) {
                        throw new Error(`Server responded with status ${productResponse.status}`);
                    }

                    

                    const productData = await productResponse.json();

                    if(productData.analysis) {
                        const rawAnalysis = productData.analysis;

                        // raw output of refined product name
                        // message += `<br><br><strong>Gemini Product Name Analysis (Raw Output):</strong><br>${rawAnalysis}<br>`;


                        let analysis;

                        try {
                            analysis = JSON.parse(rawAnalysis);
                        } catch (error) {
                            console.error("Error parsing product name data:", error);
                            analysis = null;
                        }

                        if(analysis) {
                            productName = analysis.product_name;
                        }


                    }

                    const productDetailResponse = await fetch('https://nutri-nudge.vercel.app/productDetail', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(requestedData)

                    });

                    if (!productDetailResponse.ok) {
                        throw new Error(`Server responded with status ${productDetailResponse.status}`);
                    }

                    const productDetailData = await productDetailResponse.json();


                    if(productDetailData) {
                        const rawAnalysis = productDetailData;

                        ingredientsAPI = rawAnalysis.ingredients;
                        nutrientsAPI = rawAnalysis.nutrients;
                        nutriscoreGradeAPI = rawAnalysis.nutriscoreGrade;

                        // raw output of refined product details, would not give viewable output, as rawanalysis is a json object
                        // message += `<br><br><strong>Gemini Product Detail Analysis (Raw Output):</strong><br>${rawAnalysis.ingredients}<br>`;
                    }

                } catch(error) {
                    loadingElement.style.display = 'none';

                        // Log error details to the console
                    console.error("Error processing product name:", error);
                    alert("Error processing product name. Check console for details.");
                }


                if (ingredientsOrNutrition || ingredientsAPI || nutrientsAPI) {
                    try {
                        // Prepare the data to be sent to the backend, including user preferences
                        const requestData = {
                            productName,
                            ingredientsOrNutrition,
                            ingredientsAPI,
                            nutrientsAPI,
                            userPreferences: {
                                diabetes,
                                allergies,
                                dietPlan
                            }
                        };

                        // Send the data to the backend for analysis
                        const analysisResponse = await fetch('https://nutri-nudge.vercel.app/analyze', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(requestData)
                        });

                        if (!analysisResponse.ok) {
                            throw new Error(`Server responded with status ${analysisResponse.status}`);
                        }

                        const analysisData = await analysisResponse.json();

                        // Hide the loading message after receiving the response
                        loadingElement.style.display = 'none';

                        // Print the response to the console for debugging purposes
                        console.log("Analysis Response from Backend:", analysisData);

                        // Populate the modal with analysis results
                        message += `<strong>Product:</strong> ${productName}`;
                        if(ingredientsAPI && ingredientsAPI !== "Ingredients not available") {
                            message += `<br><strong>Ingredients:</strong> ${ingredientsAPI} `;
                        } else if (response.productIngredients) {
                            message += `<br><strong>Ingredients:</strong> ${response.productIngredients.substring(13)}`;
                        }

                        // not showing nutrition information, since it does not add value for normal people
                        // if(nutrientsAPI && (nutrientsAPI == "Nutritional information not available" || Object.keys(nutrientsAPI).length === 0)) {
                        //     message += `<br><strong>Nutrition Information:</strong> ${nutrientsAPI}`;
                        // }
                        // else if (response.productNutrition) {
                        //     message += `<br><strong>Nutrition Information:</strong> ${response.productNutrition.substring(12)}`;
                        // }

                        // Add the raw analysis from Gemini model without cleaning or formatting
                        if (analysisData.analysis) {
                            let rawAnalysis = analysisData.analysis.split('*');
                            let alternativeRawAnalysis = rawAnalysis[1];
                            rawAnalysis = rawAnalysis[0];
                            console.log(rawAnalysis);

                            // Parse the cleaned JSON string
                            let analysis, alternativeAnalysis;
                            try {
                                analysis = JSON.parse(rawAnalysis);
                                alternativeAnalysis = JSON.parse(alternativeRawAnalysis);
                                // analysis = analysis[0];
                                // console.log(analysis);
                            } catch (error) {
                                console.error("Error parsing analysis data:", error);
                                analysis = null;
                                alternativeRawAnalysis = null;
                            }

                            // Raw Output
                            // message += `<br><br><strong>Gemini Analysis (Raw Output):</strong><br>${rawAnalysis}`;
                            // message += `<br><br><strong>Gemini Analysis (Raw Output):</strong><br>${alternativeRawAnalysis}`;

                            // Format the analysis data if it was successfully parsed
                            if (analysis) {
                                
                                message += `
                                    <br><br><strong>Nutritional Analysis:</strong>
                                    <ul>
                                        <li><strong>High in:</strong> ${analysis.nutritional_analysis.high_in
                                            ? analysis.nutritional_analysis.high_in.map(nutrient => `<span class="badge high-nutrient">${nutrient}</span>`).join(', ')
                                            : 'None'}</li>
                                        <li><strong>Low in:</strong> ${analysis.nutritional_analysis.low_in
                                            ? analysis.nutritional_analysis.low_in.map(nutrient => `<span class="badge low-nutrient">${nutrient}</span>`).join(', ')
                                            : 'None'}</li>
                                    </ul>
                                    <p><strong>Processing Level:</strong> <span class="processed">${analysis.processed}</span></p>
                                    ${analysis.nutrient_deficit
                                        ? `<p><strong>Nutrient Deficit:</strong> <span class="nutrient-deficit">${analysis.nutrient_deficit}</span></p>`
                                        : "" 
                                    }
                                    
                                    <p><strong>Harmful Ingredients:</strong> ${
                                        Object.keys(analysis.harmful_ingredients).length > 0
                                            ? Object.entries(analysis.harmful_ingredients).map(([type, ingredients]) => 
                                                `<span class="harmful-ingredient"><strong>${type}:</strong> ${ingredients}</span>`).join('<br>')
                                            : 'None identified'
                                    }</p>
                                    <strong>Diet Suitability:</strong>
                                    <ul>
                                    
                                        <li><strong>Diabetes:</strong> ${analysis.suitable_for_diabetes 
                                            ? (analysis.suitable_for_diabetes.includes("No") || analysis.suitable_for_diabetes.includes("no")
                                                ? `<span class="not-suitable">❌ Not suitable for people with Diabetes!! </span>`
                                                : `<span class="suitable">✔ People with Diabetes can eat this :) </span>`)
                                            : `User is not diabetic`
                                        }</li>
                                        <li><strong>Allergens:</strong> ${analysis.allergens && Object.keys(analysis.allergens).length > 0
                                            ? Object.entries(analysis.allergens).map(([allergen, value]) => value === "Yes" || value === "yes"
                                                ? `⚠️ Contains ${allergen}`
                                                : `✔ Free from ${allergen}`).join('<br>')
                                            : 'No allergens specified'
                                        }</li>
                                        ${analysis.vegetarian
                                            ? `<li><strong>Vegetarian:</strong> ${analysis.vegetarian === "Yes" || analysis.vegetarian === "yes"
                                                ? `<span class="suitable">✔ Suitable for vegetarians</span>`
                                                : `<span class="not-suitable">❌ Not suitable for vegetarians</span>`
                                            }</li>`
                                            : ""
                                        }
                                        ${analysis.keto
                                            ? `<li><strong>Keto:</strong> ${analysis.keto === "Yes" || analysis.keto === "yes"
                                                ? `<span class="suitable">✔ Suitable for keto</span>`
                                                : `<span class="not-suitable">❌ Not suitable for keto</span>`
                                            }</li>`
                                            : ""
                                        }
                                        ${analysis.Vegan
                                            ? `<li><strong>Vegan:</strong> ${analysis.Vegan === "Yes" || analysis.vegan === "yes"
                                                ? `<span class="suitable">✔ Suitable for vegans</span>`
                                                : `<span class="not-suitable">❌ Not suitable for vegans</span>`
                                            }</li>`
                                            : ""
                                        }
                                        ${analysis.paleo
                                            ? `<li><strong>Paleo:</strong> ${analysis.paleo === "Yes" || analysis.paloe === "yes"
                                                ? `<span class="suitable">✔ Suitable for paleo</span>`
                                                : `<span class="not-suitable">❌ Not suitable for paleo</span>`
                                            }</li>`
                                            : ""
                                        }
                                        
                                    </ul>
                                `;
                            } else {
                                // Printing Raw output if analysis not found
                                message += `<br><br><strong>Gemini Analysis (Raw Output):</strong><br>${rawAnalysis}`;
                            }

                            if(alternativeAnalysis && alternativeRawAnalysis.length>2) {
                                message += `<br><strong>Alternative Recommendation:</strong>`;
                                
                                message += `
                                    <ul>
                                        <li><strong>Product Name:</strong>
                                            <a href = "https://blinkit.com/s/?q=${alternativeAnalysis.alternative_recommendation.product_name}" target="_blank" rel="noopener noreferrer" class="badge alternative-product">
                                                ${alternativeAnalysis.alternative_recommendation.product_name}
                                            </a>
                                        </li>
                                    </ul>
                                `
                            }
                            

                            let nutriscoreGrade = nutriscoreGradeAPI && ['a', 'b', 'c', 'd', 'e'].includes(nutriscoreGradeAPI.toLowerCase()) ? nutriscoreGradeAPI.toLowerCase() : "unknown";
                            let nutriscoreImagePath = `/nutriscore_grades/nutriscore-${nutriscoreGrade}-new-en.svg`;

                            // Dynamically insert the Nutri-Score image
                            message += `
                                <div>
                                    <strong>Nutri-Score:</strong>
                                    <img src="${nutriscoreImagePath}" alt="Nutri-Score" style="display: inline-block; vertical-align: middle; width: 100px;" />
                                </div>`;


                        }

                        

                        // Add user preferences to the output
                        message += `<br><br><strong>User Preferences:</strong><br>`;
                        message += diabetes ? `- Has diabetes<br>` : '- No diabetes<br>';
                        if (allergies) {
                            message += `- Allergies: ${allergies}<br>`;
                        }
                        if (dietPlan && dietPlan !== "none") {
                            message += `- Follows a ${dietPlan} diet<br>`;
                        }

                        document.getElementById('analysis-results').innerHTML = message;

                        // Show the modal
                        const modal = document.getElementById('analysis-modal');
                        modal.style.display = 'block';

                    } catch (error) {
                        // Hide the loading message if an error occurs
                        loadingElement.style.display = 'none';

                        // Log error details to the console
                        console.error("Error processing analysis:", error);
                        alert("Error processing analysis. Check console for details.");
                    }
                } else {
                    // Hide the loading message if no product information was found
                    loadingElement.style.display = 'none';
                    alert("No ingredients or nutrition information found to analyze.");
                }
            } else {
                // Hide the loading message if product information couldn't be extracted
                loadingElement.style.display = 'none';
                alert("Product information could not be extracted. Please try again.");
            }
        });
    });
});

// Modal close button functionality
document.querySelector('.close-button').addEventListener('click', () => {
    const modal = document.getElementById('analysis-modal');
    modal.style.display = 'none';
});

// Show a loading message while waiting for the backend response
function showLoading() {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-message';
    loadingElement.innerText = 'Processing... Please wait.';
    loadingElement.style.display = 'none';
    document.body.appendChild(loadingElement);
}

// Add the loading message element when the page loads
showLoading();
