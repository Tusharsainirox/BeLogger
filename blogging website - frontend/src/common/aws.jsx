import axios from "axios";

export const uploadIamge = async (img) => {
  let imgUrl = null;

  await axios
    .get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url")
    .then(async ({ data: { uploadedURL } }) => {
      await axios({
        method: "PUT",
        url: uploadedURL,
        headers: { "Content-Type": "multipart/form-data" },
        data: img,
      }).then(() => {
        imgUrl = uploadedURL.split("?")[0];
      });
    });

  return imgUrl;
};
