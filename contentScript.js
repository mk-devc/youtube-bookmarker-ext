(() => {
  // accessing the player and rhe controls
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };

    currentVideoBookmarks = await fetchBookmarks();
    // storing the bookmarks as JSON in chrome storage
    chrome.storage.sync.set({
      // The JSON.stringify() method converts a JavaScript value to a JSON string,
      [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
    });
  };

  // this is an async anonymous function
  const newVideoLoaded = async () => {
    // checking the DOM if we have the bookmark button
    const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

    currentVideoBookmarks = await fetchBookmarks();

    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");
      // fetching the path in the chrome storage
      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      // added to the html class name
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";
      // DOMs that we need to manipulate
      youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName('video-stream')[0];

      youtubeLeftControls.appendChild(bookmarkBtn);

      // add a event listener to the injected bookmark + sign in the youtube
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type === "PLAY") {
      youtubePlayer.currentTime = value;
    } else if ( type === "DELETE") {
      currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
      chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });

      response(currentVideoBookmarks);
    }
  });
  // it will always call new video loaded when the match patterns matches
  newVideoLoaded();
})();

const getTime = t => {
  var date = new Date(0);
  date.setSeconds(t);

  return date.toISOString().substr(11, 8);
};
