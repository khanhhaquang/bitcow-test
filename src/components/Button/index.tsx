import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import cx from 'classnames';

import styles from './Button.module.scss';

type TProps = {
  className?: string;
  children?: any;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'outlined' | 'icon' | 'transparent';
  size?: 'large' | 'medium' | 'small';
  type?: 'button' | 'submit' | 'reset' | undefined;
  onClick?: (e: React.MouseEvent<HTMLElement>) => any;
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
    ...rest
  } = props;

  return (
    <button
      className={cx(
        'flex cursor-pointer items-center justify-center rounded-lg text-center font-medium transition-transform',
        styles[size],
        styles[variant],
        {
          'h-15 w-full rounded-none bg-color_main px-5 py-3 font-Furore text-lg text-white hover:opacity-90 tablet:h-13':
            variant === 'primary',
          'fill-color_text_1 !p-0': variant === 'icon',
          'rounded-none border-[1px] border-color_main fill-color_main px-6 py-4 text-color_main hover:bg-gray_01':
            variant === 'outlined',
          'bg-white_gray_01 text-color_text_3 dark:bg-gray_01': disabled,
          [styles.loading]: isLoading
        },
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {children}
      {isLoading && (
        <LoadingOutlined style={{ color: 'currentColor', fontSize: 16 }} className="ml-2" />
      )}
    </button>
  );
};

export default Button;
