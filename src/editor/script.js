const fs = require('fs');
const { ipcRenderer } = require('electron');

window.addEventListener('load', () => {
  initFile('index.html', 'html');
  initFile('style.css', 'css');
  initFile('script.js', 'js');

  document.getElementById('open-overlay').addEventListener('click', () => {
    ipcRenderer.invoke('open-overlay');
  });
});

function initFile(filename, idPrefix) {
  const text = document.getElementById(idPrefix + '-text');

  document.getElementById(idPrefix + '-save').addEventListener('click', () => {
    saveFile(filename, text.value, (err) => {
      if (err) {
        console.error(err);
      }

      reloadOverlay();
    });
  });

  readFile(filename, (err, data) => {
    if (err) {
      console.error(err);
    }

    text.value = data;
  });

  document.getElementById(idPrefix + '-heading').innerText = filename;
}

function readFile(filename, callback) {
  fs.readFile(`src/overlay/${filename}`, { encoding: 'utf8' }, callback);
}

function saveFile(filename, data, callback) {
  fs.writeFile(`src/overlay/${filename}`, data, callback);
}

function reloadOverlay() {
  ipcRenderer.invoke('reload-overlay');
}
