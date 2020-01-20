
var myImg = document.querySelector('img');
myImg.onclick = function () {
    var mySrc = myImg.getAttribute('src');
    if (mySrc === 'images/clothes.jpg') {
        myImg.setAttribute('src', 'images/color.jpg');
    } else {
        myImg.setAttribute('src', 'images/clothes.jpg');
    }
}

var myButton = document.querySelector('button');
var myHeading = document.querySelector('h2');

if (!localStorage.getItem('name')) {
    setUserName();
} else {
    var storedName = localStorage.getItem('name');
    myHeading.textContent = storedName;
}
myButton.onclick = function () {
    setUserName();
}
function setUserName() {
    var myName = prompt('Please enter your name.');
    localStorage.setItem('name', myName);
    myHeading.textContent =myName;
}
