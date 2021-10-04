let htmlList = document.getElementById('storedList');

let url = window.location.href;

var XMLHttp = new XMLHttpRequest();
XMLHttp.open("GET", url + "getFiles", false);
XMLHttp.send(null);
var res = XMLHttp.responseText;

res = JSON.parse(res);

html = "<ul>"

for (var i=0; i<res.length; i++) {
  console.log(res[i])
  html += "<li>" + res[i] + " <input name=\"" + res[i] + "\" id=\"getFile\" type=\"button\" value=\"Download\" onclick=\"getFile(" + i + ");\"></li>";
}

html += "</ul";

htmlList.innerHTML = html;



function getFile(index) {
  window.open(url + "getFile?index=" + index)
  // XMLHttp.open("GET", url + "getFile?index=" + index, false);
  // XMLHttp.send(null);
}