import { Tooltip } from 'components/Antd';
import { useMemo } from 'react';
import { ReactComponent as QuestionMarkIcon } from 'resources/icons/questionMark.svg';

interface TProps {
  title: string;
  status: 'completed' | 'uncompleted' | 'calculating';
  tooltipContent?: string;
}
const TaskRecord: React.FC<TProps> = ({ title, status, tooltipContent }) => {
  const content = useMemo(() => {
    if (status === 'completed') return <div className="text-green-600">Completed</div>;
    else if (status === 'uncompleted') return <div className="text-white/20">Uncompleted</div>;
    else return <div className="text-[#FFC700]">We are calculating</div>;
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
