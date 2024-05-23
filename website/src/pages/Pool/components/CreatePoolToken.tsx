import classNames from 'classnames';
import Button from 'components/Button';
import { ReactComponent as QuestionMarkIcon } from 'resources/icons/questionMark.svg';

interface TProps {
  tokenType: 'TOKEN A' | 'TOKEN B';
}

const CreatePoolToken: React.FC<TProps> = ({ tokenType }) => {
  const onClickMax = () => {};
  return (
    <div className="flex flex-1 flex-col space-y-1.5 font-pg text-lg leading-none">
      <div className="font-micro text-white/20">{tokenType}</div>
      <div className="flex flex-col space-y-3 bg-white/5 p-3">
        <div className="flex flex-col space-y-3">
          <div>Token address</div>
          <div className="flex py-2">
            <QuestionMarkIcon width={17} height={17} className="mr-2 self-center" />
            <input
              className={classNames(
                'positiveFloatNumInput flex-1',
                'focus: min-w-0 px-1 outline-none',
                'w-2/3 bg-transparent pr-0 pl-1 text-2xl text-white placeholder:text-white/20'
              )}
              placeholder="Paste here"
              inputMode="decimal"
              type="text"
            />
          </div>
        </div>
        <div className="flex flex-1">
          <span className="h-[1.5px] flex-1 bg-white/10"></span>
        </div>
        <div className="flex flex-col space-y-1.5">
          <div className="flex flex-col space-y-3">
            <div>Amount</div>
            <div className="flex p-1">
              <input
                className={classNames(
                  'positiveFloatNumInput flex-1',
                  'focus: min-w-0 px-1 outline-none',
                  'w-2/3 bg-transparent pr-0 pl-1 text-2xl text-white placeholder:text-white/20'
                )}
                placeholder="0.00"
                inputMode="decimal"
                type="text"
              />
              <Button
                onClick={onClickMax}
                className="!rounded-none bg-white/40 px-3 py-1 text-sm text-bc-blue hover:bg-bc-grey-transparent2">
                Max
              </Button>
            </div>
          </div>
          <div>Avalable: -</div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoolToken;
