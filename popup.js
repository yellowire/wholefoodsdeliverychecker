'use strict';
document.onload = popup();

function changeActive(butt) {
    var deact = document.getElementsByClassName('active');
    while (deact[0]) {
        deact[0].classList.remove('active');
    }
    butt.classList.add('active');
}

function startLoop(timeout) {
      chrome.storage.sync.set({timeout: timeout});
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.executeScript(
              tabs[0].id,
              {code: 'window.location.reload(1);'}
          );
      });
}

function changeLoop(butt) {
  let timeout = butt.value;
  changeActive(butt);
  if (timeout == 0) {
      chrome.storage.sync.set({timeout: false});
  } else {
      startLoop(timeout);
  }
};

function popup() {
    changeListener();
    var buttons = document.getElementsByTagName('button');
    for (var i = 0, len = buttons.length; i < len; i++) {
        let butt = buttons[i];
        chrome.storage.sync.get({timeout: false}, function(data) {
            let timeout = data.timeout;
            if (butt.value == timeout) {changeActive(butt)};
        });
        butt.onclick = function() {changeLoop(butt)};
    }
}

function changeListener() {
    chrome.runtime.onMessage.addListener(
        function(request, sender) {
            if (request === "timeout off") {
                let stopbutt = document.getElementById("stop");
                changeActive(stopbutt);
            }
        }
    );
}
