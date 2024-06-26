import cx from 'classnames';
import { Fragment } from 'react';

import { Drawer, Modal } from 'components/Antd';
import { useBreakpoint } from 'hooks/useBreakpoint';
import { CloseIcon } from 'resources/icons';

interface TProps {
  className?: string;
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  wrapClassName?: string;
  open: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  drawerCloseIcon?: React.ReactNode;
  maskClosable?: boolean;
  children: React.ReactNode;
  width?: number | string;
  destroyOnClose?: boolean;
  mobileHeight?: number | string;
  bodyStyle?: React.CSSProperties;
}

const BitcowModal: React.FC<TProps> = ({ className, drawerCloseIcon, ...rest }) => {
  const { isTablet } = useBreakpoint('tablet');
  return (
    <Fragment>
      {!isTablet ? (
        <Modal
          className={cx('block tablet:hidden [&>.ant-modal-content]:bg-transparent', className)}
          footer={null}
          {...rest}
        />
      ) : (
        <Drawer
          open={rest.open}
          className={cx('hidden tablet:block')}
          closable={false}
          placement="bottom"
          maskClosable
          destroyOnClose
          width="100%"
          height={rest.mobileHeight || ''}
          onClose={rest.onCancel}>
          <button
            className="drawer-close-icon absolute right-0 top-0 flex h-16 w-16 items-center justify-center"
            onClick={rest.onCancel}>
            {drawerCloseIcon ? drawerCloseIcon : <CloseIcon className="text-white" />}
          </button>
          {rest.children}
        </Drawer>
      )}
    </Fragment>
  );
};

export default BitcowModal;
