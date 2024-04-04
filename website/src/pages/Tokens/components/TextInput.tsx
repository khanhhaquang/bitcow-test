import { useFormikContext } from 'formik';

import Title from './Title';

import { ICreatePoolSetting } from '../types';

interface TProps {
  title: string;
  actionType: string;
}
const TextInput: React.FC<TProps> = ({ title, actionType }) => {
  const { values, setFieldValue } = useFormikContext<ICreatePoolSetting>();

  return (
    <div className="mt-2 flex text-2xl">
      <Title>{title}</Title>
      <input
        className="focus: ml-8 min-w-0 flex-grow border-b-2 border-b-white bg-transparent px-1 pr-0 pl-1 outline-none"
        value={values[actionType]}
        onChange={(event) => {
          setFieldValue(actionType, event.target.value);
        }}
      />
    </div>
  );
};

export default TextInput;
