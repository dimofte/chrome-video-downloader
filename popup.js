var links = [];

// Display all links in the table dom element.
// TODO: add maybe a simple template engine...
function showLinks() {

  console.log("links", links);
  document.getElementById("notifications").innerHTML = links.length ?
      '' :
      'No videos found';

  if (!links.length) {
    return;
  }

  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 0) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1]);
  }

  for (var i = 0; i < links.length; i++) {

    // icon to download
    var col0 = document.createElement('td');
    var imgDown = document.createElement('img');
    imgDown.src = 'assets/down_arrow.png';
    imgDown.title = 'Download video';
    imgDown.setAttribute('data-url', links[i].url);
    imgDown.onclick = function(event) {
      chrome.downloads.download({
        url: event.target.getAttribute('data-url'),
        saveAs: true
      }, function(id) {});
    };
    col0.appendChild(imgDown);

    // icon to open in new window
    var col1 = document.createElement('td');
    var imgOpen = document.createElement('img');
    imgOpen.src = 'assets/new_window.png';
    imgOpen.title = 'Open video in new tab';
    imgOpen.setAttribute('data-url', links[i].url);
    imgOpen.onclick = function(event) {
      chrome.tabs.create({
        url: event.target.getAttribute('data-url'),
        active: false
      });
    };
    col1.appendChild(imgOpen);

    var col2 = document.createElement('td');
    col2.innerText = links[i].name;
    col2.style.whiteSpace = 'nowrap';

    var row = document.createElement('tr');
    row.appendChild(col0);
    row.appendChild(col1);
    row.appendChild(col2);
    linksTable.appendChild(row);
  }
}

// Add links to the links array and show them.
// The scraper is injected into all frames of the active tab,
// so this listener may be called multiple times.
chrome.extension.onRequest.addListener(function(videosData) {
  for (var index in videosData) {
    links.push(videosData[index]);
  }
  showLinks();
});

// Inject the scraper script into all frames in the active tab
window.onload = function() {
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'scrape_video_urls.js', allFrames: true});
    });
  });
};
