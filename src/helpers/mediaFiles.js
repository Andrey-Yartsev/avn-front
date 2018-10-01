export const uniqId = () => {
  let ts = String(new Date().getTime()),
    i = 0,
    out = "";
  for (i = 0; i < ts.length; i += 2) {
    out += Number(ts.substr(i, 2)).toString(36);
  }
  return "d" + out;
};

export const hashCode = str => {
  let hash = 0;
  let i;
  let chr;

  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};

export const getMediaFilePreview = file => {
  return new Promise(resolve => {
    let reader = new FileReader();

    reader.onload = function(resFileData) {
      const fileContent = resFileData.target.result;
      const mediaType =
        fileContent.substr(0, 10) === "data:video" ? "video" : "photo";
      const preview = fileContent;

      let video = document.createElement("video");

      if (mediaType === "video") {
        video.addEventListener("loadeddata", () => {
          let canvas = document.createElement("canvas");
          const { videoWidth, videoHeight } = video;

          canvas.setAttribute("width", videoWidth);
          canvas.setAttribute("height", videoHeight);

          canvas
            .getContext("2d")
            .drawImage(video, 0, 0, videoWidth, videoHeight);

          const preview = canvas.toDataURL("image/jpeg");

          resolve({
            preview,
            mediaType,
            raw: fileContent
            // hash: hashCode(preview)
          });

          video = null;
          canvas = null;
        });

        video.setAttribute("src", fileContent);
      } else {
        setTimeout(() => {
          resolve({
            preview,
            mediaType,
            raw: preview
            // hash: hashCode(preview)
          });
        }, 100);
      }

      reader = null;
    };

    reader.readAsDataURL(file);
  });
};

export const fileUpload = (
  id,
  file,
  onProgress,
  token = "rg401u7mpofsg6p949gd01501a"
) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = ({ loaded, total }) => {
      onProgress(id, loaded, total);
    };
    xhr.onload = xhr.onerror = () => {
      if (xhr.status == 200) {
        resolve();
      } else {
        reject();
      }
    };
    xhr.open(
      "POST",
      `https://team2.retloko.com/api2/v2/upload?access-token=${token}`,
      true
    );
    xhr.send(file);
  });
