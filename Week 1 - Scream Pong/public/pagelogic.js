//* UI *//
var slider = document.getElementById("myRange");
var output = document.getElementById("minVol");
output.innerHTML = slider.value;

slider.oninput = function() {
  output.innerHTML = this.value;
  micMin = this.value;
}

  function changeRoom() {
    document.getElementById("gamebtn").submit();
  }