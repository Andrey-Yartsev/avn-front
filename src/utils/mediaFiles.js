import Store from "@/store";

export const uniqId = () => {
  let ts = String(new Date().getTime()),
    i = 0,
    out = "";
  for (i = 0; i < ts.length; i += 2) {
    out += Number(ts.substr(i, 2)).toString(36);
  }
  return "d" + out;
};

export const getMediaFileMeta = (file, force) => {
  return new Promise(resolve => {
    if (file.type.startsWith("video") && !force) {
      resolve({
        mediaType: "video",
        file,
        fileContent: null
      });

      return;
    }

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

      if (mediaType !== "video") {
        const temp = new Image();
        temp.src = preview;
        temp.onload = function() {
          resolve({
            mediaType,
            preview,
            file,
            fileContent,
            width: temp.width
          });
          reader = null;
        };
      } else {
        resolve({
          mediaType,
          file,
          fileContent
        });
        reader = null;
      }
    };

    reader.readAsDataURL(file);
  });
};

const snapImage = function(video, media, callback) {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
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

export const getMediaFilePreview = (media, callback) => {
  const { file } = media;

  if (file.size > 50000000) {
    callback({
      ...media,
      preview: undefined,
      needServerPreview: true
    });
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = function() {
    const blob = new Blob([fileReader.result], { type: file.type });
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");

    const timeupdate = function() {
      if (snapImage(video, media, callback)) {
        video.removeEventListener("timeupdate", timeupdate);

        if (playPromise && playPromise.then) {
          playPromise.then(() => {
            video.pause();
          });
        } else {
          video.pause();
        }
      }
    };

    video.addEventListener("loadeddata", function() {
      if (snapImage(video, media, callback)) {
        video.removeEventListener("timeupdate", timeupdate);
      }
    });

    video.addEventListener("timeupdate", timeupdate);

    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    const playPromise = video.play();
  };
  fileReader.readAsArrayBuffer(file);
};

export const fileUpload = (
  { id, file, width, mediaType, needServerPreview },
  onProgress
) => {
  const xhr = new XMLHttpRequest();
  const pr = new Promise((resolve, reject) => {
    const formData = new FormData();
    const {
      hasWatermarkPhoto,
      hasWatermarkVideo,
      watermarkText,
      watermarkFile
    } = Store.state.auth.user;

    if (
      (mediaType === "video" && hasWatermarkVideo) ||
      ((mediaType === "gif" || mediaType === "photo") && hasWatermarkPhoto)
    ) {
      if (watermarkFile) {
        formData.append("watermark[imagePath]", watermarkFile);
      } else {
        formData.append("watermark[text]", watermarkText);
        if (width) {
          formData.append("watermark[size]", width * 0.03);
        }
      }
    }
    formData.append("file", file);
    formData.append("preset", Store.state.init.data.converter.preset);
    formData.append("isDelay", true);

    if (needServerPreview) {
      formData.append("needThumb", true);
    }

    xhr.upload.onprogress = ({ loaded, total }) => {
      onProgress(id, loaded, total, xhr);
    };
    xhr.onload = xhr.onerror = () => {
      if (xhr.status == 200) {
        const processId = JSON.parse(xhr.response).processId;
        resolve(processId);
      } else {
        reject(true);
      }
    };
    xhr.onabort = () => {
      reject();
    };

    xhr.open(
      "POST",
      `${Store.state.init.data.converter.url}/file/upload`,
      true
    );
    xhr.send(formData);
  });

  pr.xhr = xhr;

  return pr;
};
