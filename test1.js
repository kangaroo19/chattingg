const body=document.querySelector("body");
const images=["스포아.png"];

const chosenImage=images[Math.floor(Math.random()*images.length)];

console.log(chosenImage);

body.style.backgroundImage='url('+chosenImage+')';