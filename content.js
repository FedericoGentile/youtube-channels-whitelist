function deleteVideosByChannel(whitelistedChannels) {
  const videoElements = document.querySelectorAll([
    'ytd-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-video-renderer.style-scope.ytd-vertical-list-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-compact-video-renderer', 
    'ytd-playlist-renderer.style-scope.ytd-item-section-renderer',
  ].join(', '));

  videoElements.forEach((videoElement) => {
    const channelLink = videoElement.querySelector('ytd-channel-name a');
    const channelText = videoElement.querySelector('ytd-channel-name yt-formatted-string');
    let channelName = '';
    if (channelLink) {
      channelName = channelLink.textContent.trim();
    } else if (channelText) {
      channelName = channelText.textContent.trim();
    }

    // If a channel name is found, check if it's whitelisted
    if (channelName) {
      const isWhitelisted = whitelistedChannels.includes(channelName);
      
      if (isWhitelisted || whitelistedChannels.length === 0) {
        // Show video if channel is whitelisted or the whitelist is empty
        videoElement.style.visibility = "visible";
        videoElement.style.height = "100%";
      } else {
        // Hide video if channel is not whitelisted
        videoElement.style.visibility = "hidden";
        videoElement.style.height = "0px";
      }
    }
  });
}

// Function to restore all videos when the toggle is off
function showAllVideos() {
  const videoElements = document.querySelectorAll([
    'ytd-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-video-renderer.style-scope.ytd-vertical-list-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-item-section-renderer',
    'ytd-compact-video-renderer.style-scope.ytd-compact-video-renderer', 
    'ytd-playlist-renderer.style-scope.ytd-item-section-renderer',
  ].join(', '));

  videoElements.forEach((videoElement) => {
    // Ensure all videos are visible when the toggle is off
    videoElement.style.visibility = "visible";
    videoElement.style.height = "100%";
  });
}

// Function to fetch whitelisted channels and apply the filter or show all videos based on toggle state
function updateVideoList() {
  chrome.storage.sync.get({ whitelistedChannels: [], isToggleOn: false }, function(data) {
    if (data.isToggleOn) {
      // If the toggle is on, apply the whitelist filtering
      deleteVideosByChannel(data.whitelistedChannels);
    } else {
      // If the toggle is off, show all videos
      showAllVideos();
    }
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
