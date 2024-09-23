function deleteVideosByChannel(whitelistedChannels) {
  // Select all relevant video elements including ytd-compact-video-renderer
  const videoElements = document.querySelectorAll([
    'ytd-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-video-renderer.style-scope.ytd-vertical-list-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-compact-video-renderer', 
    'ytd-playlist-renderer.style-scope.ytd-item-section-renderer',
  ].join(', '));

  // Loop through each video element
  videoElements.forEach((videoElement) => {
    // Find the channel name element within the video renderer
    const channelLink = videoElement.querySelector('ytd-channel-name a');
    const channelText = videoElement.querySelector('ytd-channel-name yt-formatted-string');

    // Extract the channel name
    let channelName = '';
    if (channelLink) {
      channelName = channelLink.textContent.trim();
    } else if (channelText) {
      channelName = channelText.textContent.trim();
    }

    if (channelName) {
      let isWhitelisted = false;
      whitelistedChannels.forEach((channel) => {
        if (channelName === channel) {
          isWhitelisted = true;

        }
      });
      if (isWhitelisted === true || whitelistedChannels.length === 0) {
		console.log(channelName, isWhitelisted, whitelistedChannels.length === 0)
        // Hide the video element if whitelisted
        videoElement.style.visibility = "visible";
        videoElement.style.height = "100%";
      } else {
        // Show the video element if not whitelisted
        videoElement.style.visibility = "hidden";
        videoElement.style.height = "0px";
      }
    }
  });
}

// Function to fetch whitelisted channels and apply the filter
function updateVideoList() {
  chrome.storage.sync.get({ whitelistedChannels: [] }, function(data) {
    deleteVideosByChannel(data.whitelistedChannels);
  });
}

// Initial check
updateVideoList();

// Re-run this script periodically or on page navigation
setInterval(updateVideoList, 2000);

// Listen for changes in the whitelist
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && changes.whitelistedChannels) {
    updateVideoList();
  }
});