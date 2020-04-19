document.onload = contents();

function updateEel() {
    start = sessionStorage.eeldata.lastIndexOf("#6");
    end = sessionStorage.eeldata.lastIndexOf('","#7"');
    length = end - start;
    stamp = sessionStorage.eeldata.substr(start,length);
    sliced = stamp.substr(5,24);
    myslice = new Date().toISOString();
    sessionStorage.eeldata.replace(sliced,myslice);
}

function playSound(url) {
    chrome.storage.sync.set({timeout: false});
    chrome.runtime.sendMessage(chrome.runtime.id, "timeout off");
    var audio = '<audio id="alertSound" src="'+url+'" preload="auto" muted></audio>';            
    document.body.insertAdjacentHTML('beforeend',audio);
    audio = document.getElementById('alertSound');
    audio.muted = false;
    audio.play();
}

function checkAvails() {
    var badSound = "https://freesound.org/data/previews/72/72128_1028972-lq.mp3";
    var goodSound = "https://freesound.org/data/previews/108/108800_1657645-lq.mp3";

    var result = document.getElementsByClassName("ufss-date-select-toggle-text-availability");
    if (!result[0]) {
        playSound(badSound);
    } else if (!result[0].textContent.includes('Not available') || !result[1].textContent.includes('Not available')) {
      playSound(goodSound);
    }
}

function contents() {
    chrome.runtime.sendMessage(chrome.runtime.id, "tabby");
    updateEel();
    chrome.storage.sync.get({timeout: false}, function(data){
        if (data.timeout) {
            checkAvails();
        }
    });
}
