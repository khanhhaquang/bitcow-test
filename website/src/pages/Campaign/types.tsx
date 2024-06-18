export interface ITaskRecord {
  taskid: string;
  title: string;
  progress: number;
  finished: boolean;
  finishedAt?: number;
}