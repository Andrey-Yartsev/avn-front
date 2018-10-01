export const getBottom = () =>
  window.innerHeight + window.scrollY >=
  document.getElementById("content").offsetHeight;

export const execCopy = val => {
  if (navigator.share) {
    navigator.share({
      url: val
    });
  } else {
    const input = document.createElement("input");
    const body = document.body;
    input.setAttribute("type", "text");
    input.setAttribute("style", "position: absolute; left: -999999999px");
    input.value = val;
    body.appendChild(input);
    input.select();
    document.execCommand("copy");
    body.removeChild(input);
  }
};
