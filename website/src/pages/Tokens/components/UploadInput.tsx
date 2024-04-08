import { useFormikContext } from 'formik';

import PixelButton from 'components/PixelButton';
import useUpload from 'hooks/useUpload';

import Title from './Title';

import { ICreatePoolSetting } from '../types';

interface TProps {
  title: string;
  actionType: string;
}
const UploadInput: React.FC<TProps> = ({ title, actionType }) => {
  const { values, setFieldValue } = useFormikContext<ICreatePoolSetting>();

  const { handleImgUpload } = useUpload();

  return (
    <div className="relative mt-2 flex text-2xl">
      <Title>{title}</Title>
      <input
        className="focus: relative z-10 ml-8 min-w-0 flex-grow border-b-2 border-b-white bg-transparent px-1 pr-0 pl-1 outline-none"
        value={values[actionType]}
        onChange={(event) => {
          setFieldValue(actionType, event.target.value);
        }}
      />

      {!values[actionType] && (
        <div className="absolute right-0 top-1/2 z-20 mx-auto -translate-y-1/2">
          <PixelButton width={80} height={24} borderWidth={2} className="relative mb-1 text-base">
            Upload
            <input
              type="file"
              id="image-upload"
              name="image-upload"
              accept="image/*"
              className="absolute inset-0 opacity-0"
              onChange={(event) => {
                const maxAllowedSize = 15 * 1024; // 15kb
                if (event.target.files[0].size > maxAllowedSize) {
                  event.target.value = '';
                  return;
                }

                handleImgUpload(event.target.files[0], (cdnUrl) =>
                  setFieldValue(actionType, cdnUrl)
                );
              }}
            />
          </PixelButton>
        </div>
      )}
    </div>
  );
};

export default UploadInput;
