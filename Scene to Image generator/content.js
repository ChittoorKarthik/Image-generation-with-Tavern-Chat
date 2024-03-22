console.log("content.js loaded");
console.log("prompt area = ",document.querySelector('textarea[placeholder="Prompt"]'));    // this is not working
        
var uniqueArray = [];   // to use the same yodayo image generator tab instead of creating one again and again, stores unique links of generated images

var fantasyPrompt = "beautiful face, perfect eyes";
//document.querySelector('textarea[placeholder="Prompt"]').value = fantasyPrompt;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); // Function to introduce delay



// Listen for messages from popup.js script
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
    if (message.action === "show") {
        //console.log("Received request to display secret from popup.js");
        //alert(message.secret);
        console.log("recieved prompt is : ",message.secret);
        fantasyPrompt = message.secret;
        
        console.log(document.documentElement.outerHTML);   // this is working
        var y=4;
        while(!document.querySelector('textarea[placeholder="Prompt"]')){
            //console.log("didnt find prompt section");
             delay(1000);
        }
        // this is the original element
        //<textarea placeholder="Prompt" class="min-h-[84px] w-full rounded-xl bg-card p-3 text-sm leading-5 focus:outline-none">(masterpiece), best quality, expressive eyes, perfect face</textarea>
        // Create a new textarea element
        var newTextarea = document.createElement('textarea');
        newTextarea.placeholder = "Prompt";
        newTextarea.classList.add("min-h-[84px]", "w-full", "rounded-xl", "bg-card", "p-3", "text-sm", "leading-5", "focus:outline-none");
        newTextarea.textContent = fantasyPrompt;

        // Select the existing textarea element
        var oldTextarea = document.querySelector('textarea[placeholder="Prompt"]');

        // Replace the old textarea with the new one
        oldTextarea.replaceWith(newTextarea);


     
        // if(document.querySelector('textarea[placeholder="Prompt"]'))
        // document.querySelector('textarea[placeholder="Prompt"]').value = "gigantic tits, sling bikini";

        // console.log("prompt area = ",document.querySelector('textarea[placeholder="Prompt"]'));    // this is not working
            var generateBtn=document.querySelector('.flex.h-11.w-full.items-center.justify-center.gap-1.rounded-xl.border.border-purchaseBg.bg-purchaseBg.font-bold.text-purchaseSub');
            console.log("generate btn = ",generateBtn);
            generateBtn.onclick = function() {
                console.log("generate btn clicked");
            }
            
             //generateBtn.click();

           
            while (!document.querySelector('img[alt="generated image"]') || uniqueArray.includes(document.querySelector('img[alt="generated image"]').src)) {
                //console.log("Attempting to click the button...");
                // here change the text in the prompt to goldenPrompt before clicking generate
                //console.log("prompt area = ",document.querySelector('textarea[placeholder="Prompt"]'));    // this is not working
                //document.querySelector('textarea[placeholder="Prompt"]').value="tall white woman with long hair";
                // Wait for a brief moment for the value to update in the DOM
                // await delay(500);
                 generateBtn.click(); // Click the button

                await delay(700); // Wait for 0.7 second before attempting again
            }
            uniqueArray.push(document.querySelector('img[alt="generated image"]').src);
            console.log("Image has been generated!");
            console.log("Image link = ",document.querySelector('img[alt="generated image"]').src);

            // Send a message to the background script to request sending the generated image link to other tabs
            var generatedImageLink = document.querySelector('img[alt="generated image"]').src;
            chrome.runtime.sendMessage({ action: "generatedImage",link: generatedImageLink});
            //console.log("Sent imageLink to popup.js");
            

    }
});
