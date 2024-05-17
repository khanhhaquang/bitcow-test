import React, { FC, useMemo, useState } from 'react';

interface IAvatarProps
  extends Omit<
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'src'
  > {
  source: string;
  hoverSource?: string;
}

const Avatar: FC<IAvatarProps> = ({ source, hoverSource, ...props }) => {
  const [isHover, setIsHover] = useState(false);

  const src = useMemo(() => {
    if (isHover && hoverSource) return hoverSource;
    return source;
  }, [isHover, hoverSource, source]);

  return (
    <img
      src={src}
      {...props}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    />
  );
};

export default Avatar;
