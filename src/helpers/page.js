export const getBottom = () => {
  const content = document.getElementById("content");
  return content
    ? window.innerHeight + window.scrollY >= content.offsetHeight - 600
    : false;
};
