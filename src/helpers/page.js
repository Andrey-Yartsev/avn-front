export const getBottom = () =>
  window.innerHeight + window.scrollY >=
  document.getElementById("content").offsetHeight - 600;
