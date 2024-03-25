import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import cx from 'classnames';

import styles from './Button.module.scss';

import { ReactComponent as ButtonFrame } from '../../resources/icons/buttonFrame.svg';

type TProps = {
  className?: string;
  children?: any;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outlined' | 'icon' | 'transparent' | 'pixelFrame';
  size?: 'large' | 'medium' | 'small';
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: (e: React.MouseEvent<HTMLElement>) => any;
  width?: string;
  height?: string;
};

const Button: React.FC<TProps> = (props) => {
  let {
    onClick = () => {},
    isLoading,
    className,
    disabled,
    children,
    variant = 'transparent',
    size = 'large',
    width,
    height,
    ...rest
  } = props;

  return (
    <button
      className={cx(
        'flex cursor-pointer items-center justify-center rounded-lg text-center font-medium transition-transform',
        styles[size],
        styles[variant],
        {
          'h-15 w-full rounded-none bg-color_main px-5 py-3  text-lg text-white hover:opacity-90 tablet:h-13':
            variant === 'primary',
          'fill-bc-white !p-0': variant === 'icon',
          'rounded-none border-[1px] border-color_main fill-color_main px-6 py-4 text-color_main hover:bg-gray_01':
            variant === 'outlined',
          'bg-color_disabled text-color_text_3': disabled,
          'relative bg-transparent text-bc-white': variant === 'pixelFrame',
          [styles.loading]: isLoading
        },
        className
      )}
      style={{ width, height }}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {'pixelFrame' === variant && (
        <ButtonFrame className="pointer-events-none absolute top-0 left-0 h-full w-full" />
      )}
      {children}
      {isLoading && (
        <LoadingOutlined style={{ color: 'currentColor', fontSize: 16 }} className="ml-2" />
      )}
    </button>
  );
};

export default Button;
