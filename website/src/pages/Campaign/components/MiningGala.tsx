import { Image } from 'antd';
import { useMemo } from 'react';

import useCampaign from 'hooks/useCampaign';
import bitlayerLogo from 'resources/img/bitlayerLogo.webp';
import bitlayerMask from 'resources/img/bitlayerMask.webp';
import imageYourRecord from 'resources/img/yourRecord.webp';

import TaskRecord from './TaskRecord';

const MiningGala = () => {
  const { data: campaignData } = useCampaign();
  const { data: taskInfo } = campaignData || {};

  const swapCompleted = useMemo(() => {
    if (!taskInfo) return false;
    return taskInfo.find((t) => t.title.toLowerCase() === 'swap')?.finished;
  }, [taskInfo]);
  const liquidityCompleted = useMemo(() => {
    if (!taskInfo) return false;
    return taskInfo.find((t) => t.title.toLowerCase() === 'liquidity')?.finished;
  }, [taskInfo]);
  const mintCompleted = useMemo(() => {
    if (!taskInfo) return false;
    return taskInfo.find((t) => t.title.toLowerCase() === 'mint')?.finished;
  }, [taskInfo]);
  return (
    <div className="relative mt-11 flex h-fit max-w-[1200px] flex-col overflow-hidden text-bc-white shadow-bc-swap backdrop-blur-lg tablet:mt-4">
      <div className="z-[2] grid h-[70px] grid-cols-2 items-center bg-[#FF8D00] px-6 py-3 text-black">
        <div className="font-micro text-[36px]">BITLAYER MINING GALA</div>
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
          title="Swap"
          status={swapCompleted ? 'completed' : 'uncompleted'}
          tooltipContent="Swap bitUSD-USDT (for transactions greater than 1000 bitUSD) or bitUSD-WBTC (for transactions greater than 20 bitUSD) on bitCow."></TaskRecord>
        <TaskRecord
          title="Liquidity"
          status={liquidityCompleted ? 'completed' : 'uncompleted'}
          tooltipContent="Add liquidity for bitUSD-WBTC or bitUSD-USDT."></TaskRecord>
        <TaskRecord
          title="Mint"
          status={mintCompleted ? 'completed' : 'uncompleted'}
          tooltipContent="Mint bitUSD directly on bitSmiley."></TaskRecord>
        <TaskRecord
          title="Rewards"
          status={'calculating'}
          tooltipContent="We are calculating the designated token rewards for you. Exact amount revealed soon."></TaskRecord>
      </div>
      <div className="absolute -right-3 top-0 z-0 h-auto w-[373px] opacity-50">
        <Image src={bitlayerMask} preview={false} />
      </div>
    </div>
  );
};
export default MiningGala;
