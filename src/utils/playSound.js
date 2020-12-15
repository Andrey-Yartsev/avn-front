export default name => {
  new Audio("/static/sound/" + name + ".wav").play();
};
