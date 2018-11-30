const actions = {};

actions.fundResult = () => {};

export default event => {
  if (!event.data.source || event.data.source !== "team") {
    return;
  }
  if (!event.data.type || !actions[event.data.type]) {
    return;
  }
  actions[event.data.type](event.data);
};
