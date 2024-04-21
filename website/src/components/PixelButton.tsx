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
        'relative flex cursor-pointer items-center justify-center text-white',
        'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05),_4px_4px_0px_0px_rgba(0,0,0,0.10)]',
        'hover:!bg-white/30 active:!bg-white/10 active:!text-black/20',
        { 'cursor-not-allowed opacity-60': disabled },
        { 'cursor-wait': isLoading },
        { 'text-black': isSolid },
        className
      )}
      disabled={disabled}
      style={{ width, height, ...rest.style }}
      onClick={onClick}
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
        }}
      />
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
        }}
      />
      {children} {isLoading && '...'}
    </button>
  );
}
