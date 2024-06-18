import TaskRecord from './TaskRecord';
import imageYourRecord from 'resources/img/yourRecord.webp';
import bitlayerLogo from 'resources/img/bitlayerLogo.webp';
import { Image } from 'antd';

const MiningGala = () => {
  return (
    <div className="mt-11 flex h-fit max-w-[1200px] flex-col text-bc-white shadow-bc-swap backdrop-blur-lg tablet:mt-4">
      <div className="flex h-[70px] w-full items-center bg-[#FF8D00] px-6 py-3 text-black">
        <div>BITLAYER MINING GALA</div>
        <div className="justify-self-end">
          <Image src={bitlayerLogo} width={40} height={37} preview={false} />
        </div>
      </div>
      <div className="flex gap-x-[100px] bg-black/60 py-[72px] pl-12 pr-9">
        <div className="flex gap-x-2">
          <div>
            <Image src={imageYourRecord} width={43} height={48} preview={false} />
          </div>
          <div className="font-micro text-[24px]">
            your
            <br />
            record
          </div>
        </div>
        <TaskRecord
          record={{ taskid: '001', title: 'swap', progress: 100, finished: true }}></TaskRecord>
        <TaskRecord
          record={{
            taskid: '001',
            title: 'Liquidity',
            progress: 100,
            finished: true
          }}></TaskRecord>
        <TaskRecord
          record={{ taskid: '001', title: 'mint', progress: 100, finished: true }}></TaskRecord>
        <TaskRecord
          record={{ taskid: '001', title: 'Rewards', progress: 100, finished: true }}></TaskRecord>
      </div>
    </div>
  );
};
export default MiningGala;
