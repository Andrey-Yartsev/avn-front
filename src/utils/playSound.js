export default name => {
  new Audio("/static/sound/" + name + ".mp3").play();
};
