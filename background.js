//check on tabs that were on to see if it's a youtube page
// this runs in the background while your using the function in the content script
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  // check if there is a tab url and then see if it begins with anything from 
  // youtube.com/watch
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    // after the youtube.com/watch? we will take the value fromt there
    const queryParameters = tab.url.split("?")[1];
    //what this does is kind of to manipulate or search or check for certain conditons
    // in the URL String
    const urlParameters = new URLSearchParams(queryParameters);
    console.log("test");
    console.log(urlParameters);
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    });
  }
});
