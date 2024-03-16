//popup.js

var uniqueArray = [];   // to control the alerts shown in popup.js, stores unique links of generated images
let codeExecuted = false;

var goldenPrompt = "";

chrome.runtime.onMessage.addListener(async function(Message, sender, sendResponse) {
    if (Message.action === "encodedPrompt") {
         goldenPrompt = Message.secretprompt;
        console.log("recieved prompt is ",goldenPrompt);    
    }
});

function getGoldenPrompt(){
    if(goldenPrompt != ""){
        //put the entire code here
        
    var message = goldenPrompt; // Replace with your message
    console.log("recieved golden prompt = ",goldenPrompt);
    console.log("Sending message to content.js");

    
            // Open the commercial website in a new tab without switching to it immediately
                chrome.tabs.create({url: 'https://yodayo.com/text-to-image/', active: false}, function(newTab) {  //create new tab only if it is not open,other wise use the same tab
                // Add listener to detect when the tab has finished loading
                var trigger = chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
                    console.log("Tab ID:", tabId, "ChangeInfo:", changeInfo);
                    if (!codeExecuted && tabId === newTab.id && changeInfo.status === 'complete') {
                        codeExecuted = true;
                        // here a single tab is continuosly generating images in an infinite loop
                        // Send a message to the content script of each tab
                                chrome.tabs.sendMessage(newTab.id, {secret: message, action: "show"});
                                console.log("Sent message to content.js in tab with ID:", newTab.id);

                                    
                        chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
                            if (message.action === "commercialHTML") {
                                console.log("Received HTML content from content.js");
                                console.log(message.stolen);
                                // Handle the received HTML content here
                            }
                            else if (message.action === "generatedImage") {
                                if (uniqueArray.includes(message.link)) {
                                    return;
                                }
                                else{
                                    uniqueArray.push(message.link);
                                }
                                console.log("Received generated image link from content.js");
                                //alert(message.link);
                                console.log(message.link);
                                // send the link to contentOriginal.js
                                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                    chrome.tabs.sendMessage(tabs[0].id, {action: "showGeneratedImage", Link: message.link});
                                    
                                    // Removing all image Generating tabs
                                    chrome.tabs.query({ url: 'https://yodayo.com/text-to-image/*' }, function(tabs) {
                                        // Iterate through the matching tabs and remove them
                                        tabs.forEach(function(tab) {
                                            chrome.tabs.remove(tab.id, function() {
                                                codeExecuted = false;
                                                goldenPrompt = "";
                                                console.log("1Closed tab with ID:", tab.id);
                                            });
                                        });
                                    });
                                });
                                console.log("Sent imageLink to contentOriginal.js");
                                                        

                                // Remove the listener once the message has been sent
                                //chrome.tabs.onUpdated.removeListener(trigger);  // onTabUpdated is not defined

                                // Removing all image Generating tabs SECOND TIME FOR SAFETY
                                chrome.tabs.query({ url: 'https://yodayo.com/text-to-image/*' }, function(tabs) {
                                    // Iterate through the matching tabs and remove them
                                    tabs.forEach(function(tab) {
                                        chrome.tabs.remove(tab.id, function() {
                                            codeExecuted = false;
                                            goldenPrompt = "";
                                            console.log("2Closed tab with ID:", tab.id);
                                        });
                                    });
                                });
                            }
                        });
                    }

                });

            });
    
    }
    else{
        setTimeout(getGoldenPrompt, 1000);
    }
}

document.getElementById('sendMessageButton').addEventListener('click', function() {
    console.log("Button clicked");
    chrome.runtime.sendMessage({ action: "goldenPromptRequested"});
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "goldenPromptRequested"});
    });
    console.log("sent btnclicked message to contentOriginal.js");
    // wait here for goldenPrompt to be filled with something. or decide its not possible
    //console.log("goldenPrompt at checking is ",goldenPrompt);

    getGoldenPrompt();
    
});



