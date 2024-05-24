import classNames from 'classnames';
import Button from 'components/Button';
import { ReactComponent as UploadIcon } from 'resources/icons/uploadIcon.svg';
import { ReactComponent as QuestionMarkIcon } from 'resources/icons/questionMark.svg';
import useUpload from 'hooks/useUpload';

interface TProps {
  tokenType: 'a' | 'b';
}

const CreatePoolToken: React.FC<TProps> = ({ tokenType }) => {
  const { handleImgUpload } = useUpload();
  const tokenTitle = tokenType === 'a' ? 'TOKEN A' : 'TOKEN B';
  const onClickMax = () => {};
  let iconUrl = 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png';
  let hasIcon = false;
  const setIconUrl = (cdnUrl) => {
    iconUrl = cdnUrl;
    hasIcon = true;
  };
  return (
    <div className="flex flex-1 flex-col space-y-1.5 font-pg text-lg leading-none">
      <div className="font-micro text-white/20">{tokenTitle}</div>
      <div className="flex flex-col space-y-3 bg-white/5 p-3">
        <div className="flex flex-col space-y-3">
          <div>Token address</div>
          <div className="flex flex-wrap py-2">
            {hasIcon ? (
              <img src={iconUrl} width={24} height={24} className="mr-2" />
            ) : (
              <QuestionMarkIcon width={17} height={17} className="mr-2 w-[17px] self-center" />
            )}
            <input
              className={classNames(
                'mr-2 h-[24px] flex-1 overflow-x-auto',
                'focus: outline-none',
                'bg-transparent text-2xl leading-none text-white  placeholder:text-white/20'
              )}
              placeholder="Paste here"
              inputMode="decimal"
              type="text"
            />
            <Button className="relative my-px h-[22px] w-[59px] !rounded-none bg-white/80 px-2 py-1 text-sm text-blue1 hover:bg-bc-grey-transparent2">
              <UploadIcon className="mr-2" />
              Icon
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

                  handleImgUpload(event.target.files[0], (cdnUrl) => setIconUrl(cdnUrl));
                }}
              />
            </Button>
          </div>
        </div>
        <div className="flex flex-1">
          <span className="h-[1.5px] flex-1 bg-white/10"></span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <div className="flex flex-col space-y-3">
            <div>Amount</div>
            <div className="flex flex-wrap py-[3px]">
              <input
                className={classNames(
                  'mr-2 h-[24px] flex-1 overflow-x-auto',
                  'focus: outline-none',
                  'bg-transparent text-2xl text-white placeholder:text-white/20'
                )}
                placeholder="0.00"
                inputMode="decimal"
                type="text"
              />
              <Button
                onClick={onClickMax}
                className="my-px h-[22px] !rounded-none bg-white/80 px-3 py-1 text-sm text-blue1 hover:bg-bc-grey-transparent2">
                Max
              </Button>
            </div>
          </div>
          <div className="text-sm leading-none text-white/80">Avalable: -</div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoolToken;
