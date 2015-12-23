var reqListener = function () {
  console.log(this.responseText);
};

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("GET", "main.desc");
oReq.send();
