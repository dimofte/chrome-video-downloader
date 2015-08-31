/**
 * @file Sends to the popup a sorted list of valid URLs to files with
 * video-specific extensions.
 */


// Gonna just scan the whole shabam as a string, it's an easy way to
// cover most use-cases (as opposed to using dom elements)
var allText = document.body.innerHTML.toString();

var videoExtensionList = [
  "3g2", "3gp", "3gpp", "asf", "avi", "divx", "f4v", "flv", "h264", "ifo",
  "m2ts", "m4v", "mkv", "mod", "mov", "mp4", "mpeg", "mpg", "mswmm", "mts",
  "mxf", "ogv", "rm", "swf", "ts", "vep", "vob", "webm", "wlmp", "wmv"
];
var videoExtensionsAsRegex = videoExtensionList.join('|');

// pattern to match urls that point to videos
var videoUrlRegexp = new RegExp('("|\')(http|https):\\/\\/[^("|\'|,)]*?\\.(' +
        videoExtensionsAsRegex +
        ')[^("|\')]*?("|\')',
    'gi');

console.log("videoUrlRegexp", videoUrlRegexp);

// Build the array of video urls
var videoUrls = allText.match(videoUrlRegexp) || [];
// remove quotes from around the matched urls and sort the result
videoUrls = videoUrls.map(function(quotedString) {
      return quotedString.substr(1, quotedString.length-2)
    }).sort();
// remove duplicates
var i = 0;
while (i < videoUrls.length) {
  if (((i > 0) && (videoUrls[i] == videoUrls[i - 1])) || (videoUrls[i] == '')) {
    videoUrls.splice(i, 1);
  } else {
    ++i;
  }
}

var videosData = videoUrls.map(function(videoUrl) {
  var fileNameRegex = new RegExp(
      '[^\/]+?\.(' + videoExtensionsAsRegex + ')',
      'i');
  return {
    url: videoUrl,
    name: videoUrl.match(fileNameRegex)[0]
  }
});

console.log('data', videosData);
chrome.extension.sendRequest(videosData);
