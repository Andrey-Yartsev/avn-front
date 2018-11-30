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
        file,
        fileContent
      });

      reader = null;
    };

    reader.readAsDataURL(file);
  });
};

export const getMediaFilePreview = (media, callback) => {
  const { file } = media;
  const fileReader = new FileReader();
  fileReader.onload = function() {
    const blob = new Blob([fileReader.result], { type: file.type });
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");
    const timeupdate = function() {
      if (snapImage()) {
        video.removeEventListener("timeupdate", timeupdate);
        video.pause();
      }
    };
    video.addEventListener("loadeddata", function() {
      if (snapImage()) {
        video.removeEventListener("timeupdate", timeupdate);
      }
    });
    const snapImage = function() {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL();
      const success = image.length > 100000;
      if (success) {
        callback({
          ...media,
          preview: image
        });
      }
      return success;
    };
    video.addEventListener("timeupdate", timeupdate);
    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.play();
  };
  fileReader.readAsArrayBuffer(file);
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
    xhr.open("POST", `${process.env.VUE_APP_CONVERTER_URL}/file/upload`, true);
    xhr.send(formData);
  });
