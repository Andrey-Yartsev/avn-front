function Timer(callback, delay) {
  this.delay = delay;
  this.callback = callback;
  this.timer = undefined;
  this.start = undefined;
  this.remaining = delay;
  this.status = undefined;

  this.resume();
}

Timer.prototype.get = function() {
  return this.timer;
};

Timer.prototype.pause = function() {
  clearTimeout(this.timer);
  this.status = "hold";
  this.remaining -= new Date() - this.start;
};

Timer.prototype.kill = function() {
  clearTimeout(this.timer);
  this.status = "killed";
};

Timer.prototype.resume = function() {
  this.start = new Date();
  this.timer = setTimeout(() => {
    // this.remaining = this.delay;
    // this.resume();
    this.callback();
  }, this.remaining);
  this.status = "run";
};

export default Timer;
