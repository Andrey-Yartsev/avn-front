export default {};

export const getBottom = () =>
  window.innerHeight + window.scrollY >=
  document.getElementById("content").offsetHeight;
