chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ whitelistedChannels: [], isToggleOn: false }, function(data) {
    if (!data.whitelistedChannels) {
      chrome.storage.sync.set({ whitelistedChannels: [] });
    }
    if (data.isToggleOn === undefined) {
      chrome.storage.sync.set({ isToggleOn: false });
    }
  });
});

// Function to add a channel to the whitelist
function addChannelToWhitelist(channel) {
  chrome.storage.sync.get({ whitelistedChannels: [] }, function(data) {
    const updatedList = [...data.whitelistedChannels, channel];
    chrome.storage.sync.set({ whitelistedChannels: updatedList });
  });
}

// Function to remove a channel from the whitelist
function removeChannelFromWhitelist(channel) {
  chrome.storage.sync.get({ whitelistedChannels: [] }, function(data) {
    const updatedList = data.whitelistedChannels.filter(c => c !== channel);
    chrome.storage.sync.set({ whitelistedChannels: updatedList });
  });
}

// Listen for messages from the popup to add/remove channels
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.sync.get({ isToggleOn: false }, function(data) {
    if (data.isToggleOn) {
      if (request.action === 'add') {
        addChannelToWhitelist(request.channel);
      } else if (request.action === 'remove') {
        removeChannelFromWhitelist(request.channel);
      }
    }
  });
});
