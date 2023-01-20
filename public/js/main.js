let time = 0;
setInterval(updateTime, 1000);
function updateTime() {
  time++;
  document.getElementById("time").innerHTML = time + " s";
}

