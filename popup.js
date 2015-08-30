var links = [];

// Display all links in the table dom element.
// TODO: add maybe a simple template engine...
function showLinks() {

  console.log("links", links);
  document.getElementById("notifications").innerHTML = links.length ? '' : 'No videos found';

  if (!links.length) {
    return;
  }

  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 0) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1])
  }

  for (var i = 0; i < links.length; i++) {

    // icon to download
    var col0 = document.createElement('td');
    var imgDown = document.createElement('img');
    imgDown.src = 'down_arrow.png';
    col0.appendChild(imgDown);

    // icon to open in new window
    var col1 = document.createElement('td');
    var imgOpen = document.createElement('img');
    imgOpen.src = 'new_window.png';
    imgOpen.setAttribute('data-url', links[i].url);
    imgOpen.onclick = function(event) {
      chrome.tabs.create({url: event.target.getAttribute('data-url')});
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


// Download all visible checked links.
function downloadCheckedLinks() {

  return;
  for (var i = 0; i < links.length; ++i) {
    if (document.getElementById('check' + i).checked) {
      chrome.downloads.download({url: links[i]}, function(id) {});
    }
  }
  window.close();
}

// Add links to the links array and show them.
// The scrapper is injected into all frames of the active tab,
// so this listener may be called multiple times.
chrome.extension.onRequest.addListener(function(videosData) {
  for (var index in videosData) {
    links.push(videosData[index]);
  }
  showLinks();
});

window.onload = function() {
  //document.getElementById('download').onclick = downloadCheckedLinks;

  // inject the scrapper script into all frames in the active tab
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({active: true, windowId: currentWindow.id},
                      function(activeTabs) {
      chrome.tabs.executeScript(
        activeTabs[0].id, {file: 'scrape_video_urls.js', allFrames: true});
    });
  });
};
