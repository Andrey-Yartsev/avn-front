export const uniqId = () => {
  let ts = String(new Date().getTime()),
    i = 0,
    out = "";
  for (i = 0; i < ts.length; i += 2) {
    out += Number(ts.substr(i, 2)).toString(36);
  }
  return "d" + out;
};

export const getMediaFileMeta = file => {
  return new Promise(resolve => {
    let reader = new FileReader();

    reader.onload = function(resFileData) {
      const fileContent = resFileData.target.result;
      const preview = fileContent;
      let mediaType;

      switch (true) {
        case fileContent.startsWith("data:video"):
          mediaType = "video";
          break;
        case fileContent.startsWith("data:image/gif"):
          mediaType = "gif";
          break;
        case fileContent.startsWith("data:image"):
          mediaType = "photo";
          break;
      }

      resolve({
        mediaType,
        preview: mediaType !== "video" ? preview : undefined,
        fileContent
      });

      reader = null;
    };

    reader.readAsDataURL(file);
  });
};

export const getMediaFilePreview = (media, callback) => {
  let video = document.createElement("video");

  video.addEventListener("loadeddata", () => {
    let canvas = document.createElement("canvas");
    const { videoWidth, videoHeight } = video;

    canvas.setAttribute("width", videoWidth);
    canvas.setAttribute("height", videoHeight);
    canvas.getContext("2d").drawImage(video, 0, 0, videoWidth, videoHeight);

    const preview = canvas.toDataURL("image/jpeg");

    video = null;
    canvas = null;

    callback({
      ...media,
      preview
    });
  });

  video.addEventListener("error", () => {
    callback({
      ...media,
      previewError: true
    });
  });

  video.setAttribute("src", media.fileContent);
};

export const fileUpload = ({ id, file }, onProgress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("preset", "team");
    formData.append("isDelay", true);

    xhr.upload.onprogress = ({ loaded, total }) => {
      onProgress(id, loaded, total);
    };
    xhr.onload = xhr.onerror = () => {
      if (xhr.status == 200) {
        const processId = JSON.parse(xhr.response).processId;
        resolve(processId);
      } else {
        reject();
      }
    };
    xhr.open("POST", `https://converter.retloko.com/file/upload`, true);
    xhr.send(formData);
  });
