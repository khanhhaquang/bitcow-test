import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

interface IProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  width: number;
  height: number;
  borderWidth?: number;
  color?: string;
  isLoading?: boolean;
  isSolid?: boolean;
}

export default function PixelButton({
  width,
  height,
  borderWidth = 4,
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
        'relative flex cursor-pointer items-center justify-center font-micro text-white',
        'shadow-[2px_2px_0px_0px_rgba(0,0,0,0.05),_4px_4px_0px_0px_rgba(0,0,0,0.10)]',
        'hover:!bg-white/30 active:!bg-white/10 active:!text-black/20',
        'disabled:!bg-white/10 disabled:!text-white/40',
        { 'cursor-not-allowed opacity-60': disabled },
        { 'cursor-wait': isLoading },
        { 'text-black': isSolid },
        className
      )}
      disabled={disabled}
      style={{
        width: width,
        height,
        ...rest.style
      }}
      onClick={onClick}
      {...rest}>
      <p
        className="absolute"
        style={{
          left: 0,
          top: -borderWidth,
          width,
          height: borderWidth,
          backgroundColor: color || 'transparent'
        }}
      />
      <p
        className="absolute"
        style={{
          left: 0,
          bottom: -borderWidth,
          width,
          height: borderWidth,
          backgroundColor: color || 'transparent'
        }}
      />
      <p
        className="absolute"
        style={{
          left: -borderWidth,
          top: 0,
          width: borderWidth,
          height,
          backgroundColor: color || 'transparent'
        }}
      />
      <p
        className="absolute"
        style={{
          right: -borderWidth,
          top: 0,
          width: borderWidth,
          height,
          backgroundColor: color || 'transparent'
        }}
      />
      <span className="z-10 flex items-center">
        {children}
        {isLoading && '...'}
      </span>
    </button>
  );
}
