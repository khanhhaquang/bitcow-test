import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width: number;
  height: number;
  borderWidth: number;
  color?: string;
  isLoading?: boolean;
  isSolid?: boolean;
}

export default function PixelButton({
  width,
  height,
  borderWidth,
  className,
  color = 'white',
  children,
  onClick,
  disabled,
  isLoading,
  isSolid,
  ...rest
}: IProps) {
  return (
    <button
      className={classNames(
        'relative flex cursor-pointer items-center justify-center',
        { 'cursor-not-allowed opacity-60': disabled },
        { 'cursor-wait': isLoading },
        className
      )}
      style={{ width, height, color: isSolid ? 'black' : color }}
      onClick={!disabled && onClick}
      {...rest}>
      <div
        className="absolute left-0"
        style={{
          top: borderWidth,
          width,
          height: height - 2 * borderWidth,
          borderLeftWidth: borderWidth,
          borderRightWidth: borderWidth,
          borderStyle: 'solid',
          borderColor: color,
          backgroundColor: isSolid ? color : 'transparent'
        }}></div>
      <div
        className="absolute top-0"
        style={{
          left: borderWidth,
          width: width - 2 * borderWidth,
          height,
          borderTopWidth: borderWidth,
          borderBottomWidth: borderWidth,
          borderStyle: 'solid',
          borderColor: color,
          backgroundColor: isSolid ? color : 'transparent'
        }}></div>
      <span className="z-10 flex w-full items-center justify-center">
        {children} {isLoading && '...'}
      </span>
    </button>
  );
}
