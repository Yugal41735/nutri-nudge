// Handle image processing when message is received from content script
chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.action === "processImage") {
        const nutritionalInfo = await processImageAndRetrieveInfo(request.imageUrl);
        sendResponse({ nutritionalInfo });
    }
});

// Function to fetch image and process it with Gemini
async function processImageAndRetrieveInfo(imageUrl) {
    const {
        GoogleGenerativeAI,
        GoogleAIFileManager
    } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI('YOUR_GEMINI_API_KEY');
    const fileManager = new GoogleAIFileManager('YOUR_GEMINI_API_KEY');

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    const blob = await imageResponse.blob();
    const file = new File([blob], "downloaded_image.jpg", { type: blob.type });

    // Upload the image to Gemini
    const uploadResult = await fileManager.uploadFile(file, { mimeType: file.type, displayName: file.name });
    const uploadedFile = uploadResult.file;

    // Use the Gemini API to retrieve nutritional information
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const parts = [
        { text: "Retrieve nutritional information from the image" },
        { fileData: { mimeType: uploadedFile.mimeType, fileUri: uploadedFile.uri } }
    ];

    const result = await model.generateContent({ contents: [{ role: "user", parts }] });
    return result.response.text();
}
