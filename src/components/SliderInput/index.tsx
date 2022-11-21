import cx from 'classnames';

import { Slider, SliderSingleProps } from 'components/Antd';

// import styles from './SliderInput.module.scss';

interface IProps extends SliderSingleProps {
  className?: string;
}

const SliderInput = ({ className, ...rest }: IProps) => {
  // const handleOnChange = (e) => {
  //   onChange(e.target.value);
  // };

  return (
    <div className={cx(className)}>
      <Slider className={className} {...rest} />
    </div>
  );
};

export default SliderInput;
