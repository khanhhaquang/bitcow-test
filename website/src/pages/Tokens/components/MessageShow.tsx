import Title from './Title';

interface TProps {
  title: string;
  value: string;
}
const MessageShow: React.FC<TProps> = ({ title, value }) => {
  return (
    <div className="mt-2 flex text-2xl">
      <Title>{title}</Title>
      <div className="ml-8 font-black">{value}</div>
    </div>
  );
};

export default MessageShow;
