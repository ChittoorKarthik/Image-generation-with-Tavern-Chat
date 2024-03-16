console.log("contentOriginal.js loaded");


// Create a container div for holding generated images
var containerDiv = document.createElement('div');
containerDiv.id = "imageGallery"; // Set an ID for the container div
containerDiv.style.position = "fixed";
containerDiv.style.bottom = "20px";
containerDiv.style.right = "10px";
containerDiv.style.width = "300px"; // Set the width of the container (adjust as needed)
containerDiv.style.height = "400px"; // Set the height of the container (adjust as needed)
containerDiv.style.overflowY = "auto"; // Add vertical scroll bar if needed
containerDiv.style.zIndex = "9999"; // Set a very large value for z-index
//containerDiv.style.backgroundColor = "#FFFFFF"; // Set background color

document.body.appendChild(containerDiv);
function TextToPrompt(x){
    return x;
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "showGeneratedImage") {
        var generatedImageLink = message.Link;
        console.log("Received generated image link from popup.js it is:", generatedImageLink);

        // Create an image element
        var img = document.createElement('img');

        // Set the source attribute to the received image link
        img.src = generatedImageLink;

        // Optionally, set other attributes such as alt text or width and height
        img.alt = "Generated Image";
        img.width = 200; // Set width to 200 pixels (adjust as needed)
        img.height = 200; // Set height to 200 pixels (adjust as needed)
        img.style.zIndex="9999";

        // Set the CSS margin property to create space between images
        img.style.marginBottom = "10px";

        // Append the image element to the container div
        containerDiv.appendChild(img);
    }
    else if(message.action === "goldenPromptRequested"){
        console.log("Received request to give the prompt from popup.js");
        const allMessages = document.getElementsByClassName('space-y-1.5');
        const lastMessage = allMessages[allMessages.length - 1];
        var encodedPrompt = "--";
         encodedPrompt = lastMessage.innerText;

        
        // HERE INCLUDE THE CODE TO CONVERT THE CONVERSATION TO A MEANINGFUL PROMPT -> IMAGE GENERATED DEPENDS ON THIS STEP


        //here send a message to popup.js
        console.log("sending prompt = ",encodedPrompt, " to popup.js");
        chrome.runtime.sendMessage({ action: "encodedPrompt", secretprompt: encodedPrompt });
    }
});
