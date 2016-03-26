function getCurrentTabUrl(callback) 
{
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    var tab = tabs[0];
    var url = tab.url;
    callback(url);
  });

}

function getSummary(searchTerm, callback, errorCallback) 
{

  //var searchUrl = 'https://www.readability.com/api/content/v1/parser?url=' + encodeURIComponent(searchTerm) + '&token=' + '71664c0467dc5a3cbaf4ff78ccf3af8a0085bbec';

  var searchUrl = 'https://api-2445581399224.apicast.io/api/v1/summarize?sourceURL=' + encodeURIComponent(searchTerm) + '&user_key=' + KEYS.APICAST;

  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.responseType = 'json';

  x.onload = function() {

   var response = x.response;

        if (!response) 
        {
          errorCallback('No response from API Cast!');
          return;
        } 

        callback(response);

    };

  x.onerror = function() {
            errorCallback('Network error.');
      };
  x.send();

}
function getKeywords(searchTerm, callback, errorCallback) 
{  
  //var searchUrl = 'https://api-2445581399224.apicast.io/api/v1/summarize?sourceURL=' + encodeURIComponent(searchTerm) + '&user_key=' + KEYS.APICAST;

  var searchUrl = 'http://gateway-a.watsonplatform.net/calls/url/URLGetRankedKeywords?apikey=' + KEYS.ALCHEMY + '&url=' + encodeURIComponent(searchTerm) + '&outputMode=json';


  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.responseType = 'json';

  x.onload = function() {

   var response = x.response;

        if (!response) 
        {
          errorCallback('No response from Alchemy!');
          return;
        } 

        callback(response.keywords);

    };

  x.onerror = function() {
            errorCallback('Network error.');
      };
  x.send();

}

//function getAuthor(searchTerm, callback, errorCallback) {  return; }


document.addEventListener('DOMContentLoaded', function() 
{
  getCurrentTabUrl( function(url) 
  {
    document.getElementById('title').textContent = url;

    getSummary(url, function(response) {
        document.getElementById('title').textContent = response.title;
        document.getElementById('insert').innerHTML = response.summary;
        //document.getElementById('insert').text = response.summary;
    }, 
    function(errorMessage) {
        document.getElementById('title').textContent = 'Cannot find summary. ' + errorMessage;
    });

    getKeywords(url, function(keywords) { 
        var stringbuild = "Keywords: " + keywords[0].text;

        var index;

        for(index = 1; index < keywords.length; ++index)
            stringbuild += ', ' + keywords[index].text;
        
        document.getElementById('keywords').textContent = stringbuild;
        
    }, function(errorMessage) { 
        document.getElementById('title').textContent = 'Cannot find keywords. ' + errorMessage;
    });


  });
});
