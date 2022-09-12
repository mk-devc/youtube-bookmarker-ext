// think of exxport like importing and exporting trade
// import meaning we bring code from another file 
// export meaning we allow other files to use this current code

export async function getActiveTabURL() {
    const tabs = await chrome.tabs.query({
        currentWindow: true,
        active: true
    });
  
    return tabs[0];
}

