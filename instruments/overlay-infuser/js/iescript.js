// Download by click
//----------------------------------------

document.querySelector('.download__btn').addEventListener('click', function(event) {
  window.open('/overlay-infuser.zip');
});

// script to clipboard
//----------------------------------------

var toClipboardBtn = document.querySelector('.copy-script__btn')

function getScript() {
  var xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function() {
    if (xhr.status != 200) {
      alert('Что-то пошло не так');
    } else {
      textToClipboard(('<script>' + xhr.responseText + '</script>'));
    }
  });
  xhr.open("GET", "/js/infuser.js");
  xhr.send();
}

function textToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
};

toClipboardBtn.addEventListener ('click', function(event) {
  getScript();
});

// custom properties substitute
//----------------------------------------

function customPropertiesSubstitute() {
  var styleSheet;
  styleSheet = document.createElement('link');
  styleSheet.setAttribute('rel', 'stylesheet');
  styleSheet.setAttribute('type', 'text/css');
  styleSheet.setAttribute('href', '/css/customPropertiesSubstitute.css');
  document.getElementsByTagName('head')[0].appendChild(styleSheet);
};

customPropertiesSubstitute();

document.querySelector('.settings__theme-btn').style.display = 'none';

// show/hide instructions text
//----------------------------------------

var instructionToggleBtn = document.querySelector ('.instruction__toggle-btn');
var instructions = document.querySelector('.instruction__container');

instructionToggleBtn.addEventListener ('click', function(event) {
  instructions.classList.toggle('instruction__container--show');
  instructionToggleBtn.classList.toggle('instruction__toggle-btn--clicked');
});