import { useFormikContext } from 'formik';

import Title from './Title';

import { ICreatePoolSetting } from '../types';

interface TProps {
  title: string;
  actionType: string;
  placeholderVale: string;
}
const NumberInput: React.FC<TProps> = ({ title, actionType, placeholderVale }) => {
  const { values, setFieldValue } = useFormikContext<ICreatePoolSetting>();

  return (
    <div className="mt-2 flex text-2xl">
      <Title>{title}</Title>
      <input
        className="focus: ml-8 min-w-0 flex-grow border-b-2 border-b-white bg-transparent px-1 pr-0 pl-1 text-right outline-none"
        value={values[actionType] ? values[actionType] : ''}
        placeholder={placeholderVale}
        onChange={(event) => {
          if (!/^[0-9,]*[.]?[0-9]*$/.test(event.target.value)) {
            return;
          }
          let valueStr = event.target.value
            .split('')
            .filter((l) => l !== ',')
            .join('');
          // Avoid the case to parse strings like '.123'
          if (/^\./.test(valueStr)) valueStr = '0' + valueStr;

          setFieldValue(actionType, valueStr);
        }}
      />
    </div>
  );
};

export default NumberInput;
