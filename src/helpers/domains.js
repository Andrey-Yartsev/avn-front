const gayDomain = path => {
  let host;
  const l = window.location;
  if (process.env.NODE_ENV === "development") {
    host = "gayvn.localhost:" + l.port;
  } else {
    host = process.env.VUE_APP_GAY_HOST;
  }
  let token = "";
  return (
    l.protocol + "//" + host + (path !== undefined ? path : l.pathname) + token
  );
};

const straightDomain = path => {
  let host;
  const l = window.location;
  if (process.env.NODE_ENV === "development") {
    host = "localhost:" + l.port;
  } else {
    host = process.env.VUE_APP_STRAIGHT_HOST;
  }
  let token = "";
  return (
    l.protocol + "//" + host + (path !== undefined ? path : l.pathname) + token
  );
};

module.exports = {
  gayDomain,
  straightDomain
};
