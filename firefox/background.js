browser.runtime.onInstalled.addListener(() => {
  browser.storage.sync.get({ whitelistedChannels: [], isToggleOn: false }, function(data) {
    if (!data.whitelistedChannels) {
      browser.storage.sync.set({ whitelistedChannels: [] });
    }
    if (data.isToggleOn === undefined) {
      browser.storage.sync.set({ isToggleOn: false });
    }
  });
});

// Function to add a channel to the whitelist
function addChannelToWhitelist(channel) {
  browser.storage.sync.get({ whitelistedChannels: [] }, function(data) {
    const updatedList = [...data.whitelistedChannels, channel];
    browser.storage.sync.set({ whitelistedChannels: updatedList });
  });
}

// Function to remove a channel from the whitelist
function removeChannelFromWhitelist(channel) {
  browser.storage.sync.get({ whitelistedChannels: [] }, function(data) {
    const updatedList = data.whitelistedChannels.filter(c => c !== channel);
    browser.storage.sync.set({ whitelistedChannels: updatedList });
  });
}