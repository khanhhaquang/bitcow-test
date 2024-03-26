import classNames from 'classnames';

import { ReactComponent as LeftTriangle } from 'resources/icons/leftTri.svg';
import { ReactComponent as RightTriangle } from 'resources/icons/rightTri.svg';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function PixelDivider({ className, color }: IProps) {
  return (
    <div className={classNames('flex items-center gap-x-1', className)}>
      <LeftTriangle className="h-[17px] w-[12px]" style={{ color }} />
      <div className="h-[2px] flex-1" style={{ backgroundColor: color }}></div>
      <RightTriangle className="h-[17px] w-[12px]" style={{ color }} />
    </div>
  );
}
