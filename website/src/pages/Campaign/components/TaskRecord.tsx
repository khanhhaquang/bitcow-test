import { Tooltip } from 'components/Antd';
import { useMemo } from 'react';
import { ReactComponent as QuestionMarkIcon } from 'resources/icons/questionMark.svg';
import { ReactComponent as TaskCheckIcon } from 'resources/icons/taskCheck.svg';

interface TProps {
  title: string;
  status: 'completed' | 'uncompleted' | 'calculating';
  tooltipContent?: string;
}
const TaskRecord: React.FC<TProps> = ({ title, status, tooltipContent }) => {
  const content = useMemo(() => {
    if (status === 'completed')
      return (
        <div className="flex items-center gap-x-1 text-[#4DD12C]">
          Completed
          <TaskCheckIcon width={17} height={12} className="mb-1" />
        </div>
      );
    else if (status === 'uncompleted')
      return <div className="items-center text-white/20">Uncompleted</div>;
    else
      return (
        <div className="flex items-center gap-x-1 text-[#FFC700]">
          We are calculating
          <img src="/images/coin.gif" alt="coin" className="mb-1 h-6 w-[22px]" />
        </div>
      );
  }, [status]);
  return (
    <div className="flex flex-col gap-y-[12px] font-pdb text-[18px]">
      <div className="flex items-center gap-1 text-white">
        <div>{title}</div>
        <Tooltip placement="top" title={tooltipContent}>
          <QuestionMarkIcon
            fillOpacity={1}
            width={12}
            height={12}
            className="mb-1 cursor-pointer"
          />
        </Tooltip>
      </div>
      {content}
    </div>
  );
};
export default TaskRecord;
