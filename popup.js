var links = [];

// Display all links in the table dom element.
function showLinks() {

  console.log("links", links);
  if (links.length === 0) {
    document.getElementById("notifications").innerHTML = 'No videos found';
    return;
  }

  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 1) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1])
  }

  for (var i = 0; i < links.length; ++i) {

    var col0 = document.createElement('td');
    var link = document.createElement('a');
    link.href = links[i];
    link.innerHTML = 'link';
    col0.appendChild(link);

    var col1 = document.createElement('td');
    col1.innerHTML = 'download';

    var col2 = document.createElement('td');
    col2.innerText = 'foo.mp4';
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
chrome.extension.onRequest.addListener(function(foundLinks) {
  console.log("found links", foundLinks);

  for (var index in foundLinks) {
    links.push(foundLinks[index]);
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
