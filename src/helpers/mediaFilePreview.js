export default file => {
  return new Promise(resolve => {
    let reader = new FileReader();

    reader.onload = function(resFileData) {
      const fileContent = resFileData.target.result;
      const mediaType =
        fileContent.substr(0, 10) === "data:video" ? "video" : "photo";
      const preview = fileContent;

      if (mediaType === "video") {
        let canvas = document.createElement("canvas");
        let video = document.createElement("video");

        video.addEventListener("loadeddata", () => {
          canvas
            .setAttribute("width", video.videoWidth)
            .setAttribute("height", video.videoHeight)
            .getContext("2d")
            .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

          const preview = canvas.toDataURL("image/jpeg");

          resolve({
            preview,
            mediaType,
            raw: fileContent
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
          });
        }, 100);
      }

      reader = null;
    };

    reader.readAsDataURL(file);
  });
};
