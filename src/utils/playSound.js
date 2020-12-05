export default name => {
  const audio = new Audio("/static/sound/" + name + ".mp3");
  audio.play();
};
