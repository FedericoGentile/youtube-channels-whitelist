function updateVideoVisibility(whitelistedChannels, isToggleOn) {
  // Select all relevant video elements including ytd-compact-video-renderer
  const videoElements = document.querySelectorAll([
    'ytd-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-video-renderer.style-scope.ytd-vertical-list-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-compact-video-renderer', 
    'ytd-playlist-renderer.style-scope.ytd-item-section-renderer',
  ].join(', '));

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

    // If toggle is off, show all videos
    if (!isToggleOn) {
      videoElement.style.visibility = "visible";
      videoElement.style.height = "100%";
    } else if (channelName) {
      // If toggle is on, filter based on whitelist
      const isWhitelisted = whitelistedChannels.includes(channelName);

      if (isWhitelisted || whitelistedChannels.length === 0) {
        // Show the video if it's whitelisted or the whitelist is empty
        videoElement.style.visibility = "visible";
        videoElement.style.height = "100%";
      } else {
        // Hide the video if it's not whitelisted
        videoElement.style.visibility = "hidden";
        videoElement.style.height = "0px";
      }
    }
  });
}

// Function to fetch whitelisted channels and apply the filter or show all videos based on toggle state
function updateVideoList() {
  chrome.storage.sync.get({ whitelistedChannels: [], isToggleOn: false }, function(data) {
    updateVideoVisibility(data.whitelistedChannels, data.isToggleOn);
  });
}

// Initial check
updateVideoList();

// Re-run this script periodically or on page navigation
setInterval(updateVideoList, 2000);

// Listen for changes in the whitelist or toggle state
chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === 'sync' && (changes.whitelistedChannels || changes.isToggleOn)) {
    updateVideoList();
  }
});
