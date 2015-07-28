var myCircle = document.querySelector(".circle")

myCircle.addEventListener("mousedown", function() {
  myCircle.className = "bigCircle"
})
myCircle.addEventListener("mouseup", function() {
  myCircle.className = "circle"
})
