import cx from 'classnames';
import { Fragment } from 'react';

import { Drawer, Modal } from 'components/Antd';
import { CancelIcon } from 'resources/icons';

import styles from './HippoModal.module.scss';

interface TProps {
  className?: string;
  onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  wrapClassName?: string;
  open: boolean;
  closable?: boolean;
  closeIcon?: React.ReactNode;
  children: React.ReactNode;
  width?: number | string;
  destroyOnClose?: boolean;
  mobileHeight?: number | string;
}

const HippoModal: React.FC<TProps> = ({ className, ...rest }) => {
  return (
    <Fragment>
      <Modal
        className={cx(styles.modal, 'block tablet:hidden', className)}
        footer={null}
        {...rest}
      />
      <Drawer
        open={rest.open}
        className={cx(styles.drawer, 'hidden tablet:block')}
        closable={false}
        placement="bottom"
        destroyOnClose
        width="100%"
        height={rest.mobileHeight || ''}
        onClose={rest.onCancel}>
        <div
          className="absolute right-0 top-0 flex h-16 w-16 items-center justify-center"
          onClick={rest.onCancel}>
          <CancelIcon className="h-6 w-6" />
        </div>
        {rest.children}
      </Drawer>
    </Fragment>
  );
};

export default HippoModal;
