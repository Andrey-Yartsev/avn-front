import Store from "@/store";
import { logDebug } from "@/utils/logging";

export const uniqId = () => {
  let ts = String(new Date().getTime()),
    i = 0,
    out = "";
  for (i = 0; i < ts.length; i += 2) {
    out += Number(ts.substr(i, 2)).toString(36);
  }
  return "d" + out;
};

const getOrientation = file => {
  return new Promise(async resolve => {
    const reader = new FileReader();

    reader.onload = resFileData => {
      const fileContent = resFileData.target.result;
      const view = new DataView(fileContent);
      if (view.getUint16(0, false) != 0xffd8) {
        resolve(-2);
      }
      const length = view.byteLength;
      let offset = 2;

      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8) {
          resolve(-1);
        }

        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker == 0xffe1) {
          if (view.getUint32((offset += 2), false) != 0x45786966) {
            resolve(-1);
          }

          let little = view.getUint16((offset += 6), false) == 0x4949;
          offset += view.getUint32(offset + 4, little);
          if (offset >= length) {
            resolve(-1);
          }
          let tags = view.getUint16(offset, little);
          offset += 2;
          for (let i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) == 0x0112) {
              resolve(view.getUint16(offset + i * 12 + 8, little));
            }
          }
        } else if ((marker & 0xff00) != 0xff00) {
          break;
        } else {
          offset += view.getUint16(offset, false);
        }
      }
      resolve(-1);
    };

    reader.readAsArrayBuffer(file);
  });
};

export const getMediaFileMeta = file => {
  const isVideo = file.type.startsWith("video");
  const isGif = file.type.startsWith("image/gif");
  const isImage = file.type.startsWith("image");
  const isAudio = file.type.startsWith("audio");

  let mediaType;

  switch (true) {
    case isVideo:
      mediaType = "video";
      break;
    case isGif:
      mediaType = "gif";
      break;
    case isImage:
      mediaType = "photo";
      break;
    case isAudio:
      mediaType = "audio";
      break;
  }

  return {
    mediaType,
    file,
    size: file.size,
    name: file.name
  };
};

export const readFileContent = (media, callback) => {
  const { file } = media;
  const reader = new FileReader();

  reader.onload = resFileData => {
    const fileContent = resFileData.target.result;
    callback({
      ...media,
      fileContent: fileContent
    });
  };

  reader.readAsDataURL(file);
};

export const getImagePreview = (media, callback) => {
  readFileContent(media, newMedia => {
    getOrientation(media.file).then(orientation => {
      const temp = new Image();
      temp.src = newMedia.fileContent;
      temp.onload = () => {
        const width = temp.width;
        const height = temp.height;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (orientation > 4 && orientation < 9) {
          canvas.width = height;
          canvas.height = width;
        } else {
          canvas.width = width;
          canvas.height = height;
        }

        switch (orientation) {
          case 2:
            ctx.transform(-1, 0, 0, 1, width, 0);
            break;
          case 3:
            ctx.transform(-1, 0, 0, -1, width, height);
            break;
          case 4:
            ctx.transform(1, 0, 0, -1, 0, height);
            break;
          case 5:
            ctx.transform(0, 1, 1, 0, 0, 0);
            break;
          case 6:
            ctx.transform(0, 1, -1, 0, height, 0);
            break;
          case 7:
            ctx.transform(0, -1, -1, 0, height, width);
            break;
          case 8:
            ctx.transform(0, -1, 1, 0, 0, width);
            break;
          default:
            break;
        }

        ctx.drawImage(temp, 0, 0);
        const base64 = canvas.toDataURL();

        callback({
          ...media,
          preview: base64,
          params: {
            width: temp.width,
            height: temp.height
          }
        });
      };
    });
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

export const getVideoPreview = (media, callback) => {
  const { file } = media;

  if (file.size > 50000000) {
    callback({
      ...media,
      preview: undefined
    });
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = function() {
    const blob = new Blob([fileReader.result], { type: file.type });
    const url = URL.createObjectURL(blob);
    const video = document.createElement("video");

    video.addEventListener("loadeddata", function() {
      snapImage(video, media, callback);
    });

    video.preload = "metadata";
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    video.play().catch(() => {});
  };
  fileReader.readAsArrayBuffer(file);
};

export const converterUpload = (
  { /* id, */ mediaType, file },
  onProgress,
  withoutWatermark
) => {
  const xhr = new XMLHttpRequest();
  const isBinary = !!file.lastModified;

  const pr = new Promise((resolve, reject) => {
    const {
      hasWatermarkPhoto,
      hasWatermarkVideo,
      watermarkText,
      // watermarkFile,
      watermarkFileUpload
    } = Store.state.auth.user;

    const getLogData = extra => {
      const logData = {
        mediaType
      };
      if (file.name) {
        logData.name = file.name;
      } else {
        if (!file.Key) {
          throw new Error("Wrong upload logic");
        }
        logData.Key = file.Key;
        logData.ETag = file.ETag;
      }
      if (extra) {
        for (let [key, value] of Object.entries(extra)) {
          logData[key] = value;
        }
      }
    };

    const data = {};

    if (!withoutWatermark) {
      if (
        (mediaType === "video" && hasWatermarkVideo) ||
        ((mediaType === "gif" || mediaType === "photo") && hasWatermarkPhoto)
      ) {
        // if (watermarkFile) {
        //   formData.append("watermark[imagePath]", watermarkFile);
        if (watermarkFileUpload) {
          data["watermark"] = {
            imagePath: watermarkFileUpload
          };
        } else {
          data["watermark"] = {
            text: watermarkText
          };
        }
      }
    }

    data["file"] = file;
    data["preset"] = Store.state.init.data.converter.preset;
    data["isDelay"] = true;

    if (mediaType === "video") {
      data["needThumbs"] = true;
    }

    // Uses only for non-s3 version
    //
    // xhr.upload.onprogress = ({ loaded, total }) => {
    //   if (onProgress) {
    //     onProgress(id, loaded, total, file, "Converter");
    //   }
    // };

    xhr.onload = xhr.onerror = () => {
      if (xhr.status == 200) {
        const { processId, thumbs } = JSON.parse(xhr.response);
        const result = { processId, thumbs };
        logDebug({
          logger: "Converter",
          message: "Upload success",
          logData: getLogData({ result })
        });
        resolve({
          processId,
          thumbs
        });
      } else {
        let error = null;
        try {
          const r = JSON.parse(xhr.response);
          if (r.error) {
            error = r.error;
          } else {
            error = { message: "Error on upload" };
          }
        } catch (e) {
          error = { message: "Error on upload" };
        }
        logDebug({
          logger: "Converter",
          message: "Upload error",
          logData: getLogData({ error })
        });
        reject(error);
      }
    };
    xhr.onabort = () => {
      logDebug({
        logger: "Converter",
        message: "Upload aborted",
        logData: getLogData()
      });
      reject();
    };

    logDebug({
      message: "Send data to converter",
      logger: "Converter",
      logData: getLogData()
    });

    xhr.open("POST", `${Store.state.init.data.converter.url}`, true);

    if (isBinary) {
      const formData = new FormData();
      for (let [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }
      xhr.send(formData);
    } else {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data));
    }
  });

  pr.xhr = xhr;

  return pr;
};

export const convertImgToBase64URL = (url, callback) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.onload = function() {
    let canvas = document.createElement("CANVAS");
    const ctx = canvas.getContext("2d");
    let dataURL;
    canvas.height = img.height;
    canvas.width = img.width;
    ctx.drawImage(img, 0, 0);
    dataURL = canvas.toDataURL("image/png");
    callback(dataURL);
    canvas = null;
  };
  img.src = url;
};
