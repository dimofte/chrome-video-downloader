/**
 * @file Sends to the popup a sorted list of valid URLs to files with mp4,avi,flv,f4v,ogv or ogg extension.
 */

var allText = document.body.innerHTML.toString();
var videoUrls = allText
    // find urls that point to movies
    .match(/("|')(http|https):\/\/[^("|'|,)]*?\.(mp4|avi|flv|f4v|ogv|ogg)[^("|')]*?("|')/gi) || [];

// remove quotes from around the matched urls and sort the result
videoUrls = videoUrls.map(function(quotedString) {
      return quotedString.substr(1, quotedString.length-2)
    }).sort();

// Remove duplicates
var i = 0;
while (i < videoUrls.length) {
  if (((i > 0) && (videoUrls[i] == videoUrls[i - 1])) || (videoUrls[i] == '')) {
    videoUrls.splice(i, 1);
  } else {
    ++i;
  }
}

console.log("vids", videoUrls);
var videosData = videoUrls.map(function(videoUrl) {
  return {
    url: videoUrl,
    name: videoUrl.match(/[^\/]+?\.(mp4|avi|flv|f4v|ogv|ogg)/i)[0]
  }
});
chrome.extension.sendRequest(videosData);
