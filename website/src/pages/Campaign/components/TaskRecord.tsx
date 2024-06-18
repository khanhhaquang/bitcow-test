import { Tooltip } from 'components/Antd';
import { ReactComponent as QuestionMarkIcon } from 'resources/icons/questionMark.svg';

import { ITaskRecord } from '../types';

interface TProps {
  record: ITaskRecord;
  tooltipContent?: string;
}
const TaskRecord: React.FC<TProps> = ({ record, tooltipContent }) => {
  return (
    <div className="flex flex-col gap-y-[12px] font-pdb text-[18px]">
      <div className="flex items-center gap-1 text-white">
        <div>{record.title}</div>
        <Tooltip placement="top" title={tooltipContent}>
          <QuestionMarkIcon
            fillOpacity={1}
            width={12}
            height={12}
            className="mb-1 cursor-pointer"
          />
        </Tooltip>
      </div>
      <div className="text-green-600">{record.finished ? 'Completed' : 'Uncompleted'}</div>
    </div>
  );
};
export default TaskRecord;
