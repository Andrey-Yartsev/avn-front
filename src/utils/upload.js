import Store from "@/store";

export default file => {
  return new Promise((accept, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      process.env.VUE_APP_API_URL +
        "/upload?access-token=" +
        Store.state.auth.token,
      true
    );
    xhr.onload = e => {
      const result = JSON.parse(e.currentTarget.responseText);
      if (result.error) {
        reject(result.error);
        return;
      }
      accept(result[0].fileName);
    };
    xhr.send(formData);
  });
};
