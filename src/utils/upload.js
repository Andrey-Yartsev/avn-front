import Store from "@/store";

export default (file, type, opt = {}) => {
  if (!type) {
    type = "image";
  }
  return new Promise((accept, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      process.env.VUE_APP_API_URL +
        "/upload/" +
        type +
        "?access-token=" +
        Store.state.auth.token,
      true
    );
    xhr.onload = e => {
      const result = JSON.parse(e.currentTarget.responseText);
      if (!result || !result[0] || !result[0].fileName) {
        const response = {
          message:
            result.error && result.error.message
              ? result.error.message
              : "Upload failed"
        };
        return reject(response);
      }
      if (result.error) {
        if (result.error.message === "getimagesize(): Read error!") {
          return reject({ message: "Uploaded file is not valid image" });
        }
        return reject(result.error);
      }
      accept(result[0].fileName);
    };
    xhr.upload.onprogress = ({ loaded, total }) => {
      if (opt.onProgress) {
        opt.onProgress(loaded, total);
      }
    };
    xhr.send(formData);
  });
};
