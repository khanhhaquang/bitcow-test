import { Tooltip as AntdTooltip } from 'components/Antd';
import classNames from 'classnames';
import { TooltipPropsWithTitle } from 'antd/lib/tooltip';
import styles from './Tooltip.module.scss';

interface TProps extends TooltipPropsWithTitle {
  className?: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TProps> = ({ className, children, ...props }) => {
  return (
    <div className={classNames(styles.tooltip, className)}>
      <AntdTooltip {...props}>{children}</AntdTooltip>
    </div>
  );
};

export default Tooltip;
