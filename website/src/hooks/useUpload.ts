import { toTruncateStr } from 'utils/formatter';

const CDN_DOMAIN = 'https://memesdev.bitsmiley.io/';
const UPLOAD_URL = 'https://devmeme.bitsmiley.io/upload';

const useUpload = () => {
  const handleImgUpload = async (file: File, callback?: (cdnUrl) => void) => {
    try {
      const formattedName = toTruncateStr(file.name);
      const params = new FormData();
      params.append('file', file, formattedName);
      params.append('name', formattedName);

      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          enctype: 'multipart/form-data'
        },
        body: params
      });
      const result = await res.text();
      if (result && callback) {
        callback(CDN_DOMAIN + result);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return {
    handleImgUpload
  };
};

export default useUpload;
