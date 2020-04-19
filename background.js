chrome.runtime.onInstalled.addListener(function() {
    tabListener();
    pageChecker();

    function beginLoop(tabId, data) {
        setTimeout(function(){
          chrome.storage.sync.get({timeout: false}, function(data) {
              if (data.timeout){
                  chrome.tabs.executeScript(tabId,
                      {code: 'window.location.reload(1);'}
                  );
              } else {
                  return;
              }
          });
        }, data.timeout);
    }

    function tabListener() {
        var tabId;
        chrome.runtime.onMessage.addListener(function(request, sender) {
            if (request === "tabby") {
                tabId = sender.tab.id;
                chrome.tabs.onRemoved.addListener(function(tabId) {
                    chrome.storage.sync.set({timeout: false});
                });
                chrome.storage.sync.get({timeout: false}, function(data) {
                    if (data.timeout) {
                        beginLoop(tabId, data);
                    }
                });
            }
        });
    }

    function pageChecker() {
        chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
            chrome.declarativeContent.onPageChanged.addRules([{
              conditions: [new chrome.declarativeContent.PageStateMatcher({
                  pageUrl: {hostEquals: 'www.amazon.com', urlContains: 'gp/buy/shipoptionselect/'},
              })],
              actions: [new chrome.declarativeContent.ShowPageAction()]
            }]);
        });
    }
});

chrome.runtime.onSuspend.addListener(function() {
    chrome.storage.sync.set({timeout: false});
});

