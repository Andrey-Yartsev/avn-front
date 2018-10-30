export default function(val) {
  if (navigator.share) {
    navigator.share({
      url: val
    });
  } else {
    var input = document.createElement("input"),
      body = document.body;
    input.setAttribute("type", "text");
    input.setAttribute("style", "position: absolute; left: -999999999px");
    input.value = val;
    body.appendChild(input);
    input.select();
    document.execCommand("copy");
    body.removeChild(input);
  }
}
