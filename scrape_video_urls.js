/**
 * @file Sends to the popup a sorted list of valid URLs to files with mp4,avi,flv,f4v,ogv or ogg extension.
 */

var allText = document.body.innerHTML.toString();
var video_urls = allText
    // find urls that point to movies
    .match(/("|')(http|https):\/\/[^("|'|,)]*?\.(mp4|avi|flv|f4v|ogv|ogg)[^("|')]*?("|')/gi) || [];

// remove quotes from around the matched urls and sort the result
video_urls
    .map(function(quotedString) {
      return quotedString.substr(1, quotedString.length-2)
    })
    .sort();

// Remove duplicates
var i = 0;
while (i < video_urls.length) {
  if (((i > 0) && (video_urls[i] == video_urls[i - 1])) || (video_urls[i] == '')) {
    video_urls.splice(i, 1);
  } else {
    ++i;
  }
}

chrome.extension.sendRequest(video_urls);
