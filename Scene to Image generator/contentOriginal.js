console.log("contentOriginal.js loaded");


// // Create a container div for holding generated images
// var containerDiv = document.createElement('div');
// containerDiv.id = "imageGallery"; // Set an ID for the container div
// containerDiv.style.position = "fixed";
// containerDiv.style.bottom = "20px";
// containerDiv.style.right = "10px";
// containerDiv.style.width = "300px"; // Set the width of the container (adjust as needed)
// containerDiv.style.height = "400px"; // Set the height of the container (adjust as needed)
// containerDiv.style.overflowY = "auto"; // Add vertical scroll bar if needed
// containerDiv.style.zIndex = "9999"; // Set a very large value for z-index
// containerDiv.style.backgroundColor = "#FFFFFF"; // Set background color


// Create the container div for holding generated images
var containerDiv = document.createElement('div');
containerDiv.id = "imageGallery";
containerDiv.style.position = "fixed";
containerDiv.style.top = "0";
containerDiv.style.left = "0";
containerDiv.style.width = "220px";
containerDiv.style.height = "350px";
containerDiv.style.overflowY = "auto";
containerDiv.style.zIndex = "9999";
//containerDiv.style.backgroundColor = "#FFFFFF";

// Create the button-like element
var buttonLikeElement = document.createElement('div');
buttonLikeElement.style.position = "absolute";
buttonLikeElement.style.top = "10px"; // Adjust the top position as needed
buttonLikeElement.style.left = "10px"; // Adjust the left position as needed
buttonLikeElement.style.width = "20px"; // Adjust the width as needed
buttonLikeElement.style.height = "20px"; // Adjust the height as needed
buttonLikeElement.style.backgroundColor = "yellow"; // Adjust the background color as needed
buttonLikeElement.style.cursor = "move"; // Change cursor to indicate draggable
// buttonLikeElement.style.backgroundImage = "url('C:\\Users\\Karthik Chittoor\\Desktop\\Browser Extensions Projects\\Scene to Image generator\\hook.jpg')";
// buttonLikeElement.style.backgroundSize = "cover"; // Adjust as needed
// buttonLikeElement.style.backgroundRepeat = "no-repeat";
buttonLikeElement.style.zIndex = "10000"; // Set a higher z-index than the container div

// Add event listeners for dragging functionality
var isDragging = false;
var offsetX, offsetY;

buttonLikeElement.addEventListener('mousedown', function(event) {
    isDragging = true;
    offsetX = event.clientX - containerDiv.offsetLeft;
    offsetY = event.clientY - containerDiv.offsetTop;
});

document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        containerDiv.style.left = (event.clientX - offsetX) + 'px';
        containerDiv.style.top = (event.clientY - offsetY) + 'px';
        buttonLikeElement.style.left = (event.clientX - offsetX) + 'px';
        buttonLikeElement.style.top = (event.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Append the container div to the button-like element
buttonLikeElement.appendChild(containerDiv);

// Append the button-like element to the document body
document.body.appendChild(buttonLikeElement);


//document.body.appendChild(containerDiv);
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
