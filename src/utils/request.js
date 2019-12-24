import Store from "@/store";

function handleVersionHeader(header) {
  const version = header.split("-")[1];
  const currentVersion = Store.state.version.currentVersion;
  if (version != currentVersion) {
    Store.commit("version/setNewVersion", version);
  }
}

export default async (apiPath, options) => {
  if (options.data) {
    options.body = JSON.stringify(options.data);
  }
  if (!options.headers) {
    options.headers = { "Content-Type": "application/json" };
  }
  return new Promise((resolve, reject) => {
    fetch(process.env.VUE_APP_API_URL + "/" + apiPath, options)
      .then(res => {
        for (let key of res.headers) {
          if (key[0] === "last-modified") {
            handleVersionHeader(key[1]);
          }
        }
        resolve(res);
      })
      .catch(err => {
        reject(err);
      });
  });
};
