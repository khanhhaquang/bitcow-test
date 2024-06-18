import { ITaskRecord } from '../types';

interface TProps {
  record: ITaskRecord;
}
const TaskRecord: React.FC<TProps> = ({ record }) => {
  return (
    <div className="flex flex-col gap-y-[12px] font-pdb text-[18px]">
      <div className="text-white">{record.title}</div>
      <div className="text-green-600">{record.finished ? 'Completed' : 'Uncompleted'}</div>
    </div>
  );
};
export default TaskRecord;
