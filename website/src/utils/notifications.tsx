import { ReactNode } from 'react';

import { notification } from 'components/Antd';
import TextLink from 'components/TextLink';
import { NotiErrorIcon, HintIcon, NotiSuccessIcon, CloseIcon } from 'resources/icons';

type NotificationType = 'success' | 'error' | 'info' | 'warn';

interface INotificationArgs {
  detail: ReactNode;
  type?: NotificationType;
  title?: ReactNode;
  duration?: number;
}

const openNotification = ({ detail, type = 'success', title = '' }: INotificationArgs) => {
  if (!title) {
    title = type[0].toUpperCase() + type.slice(1);
  }

  let icon: ReactNode;
  if (type === 'success') {
    icon = <NotiSuccessIcon />;
  } else if (type === 'error') {
    icon = <NotiErrorIcon />;
  } else if (type === 'info') {
    icon = <HintIcon />;
  }

  notification.open({
    message: title,
    description: detail,
    placement: 'topRight',
    icon,
    className: `obric-notification obric-notification--${type}`,
    closeIcon: <CloseIcon className="bottom-1 h-full w-full text-white" />,
    top: 180,
    duration: 6
  });
};

export const openErrorNotification = (args: INotificationArgs) =>
  openNotification({ type: 'error', ...args });

export const openTxSuccessNotification = (url: string, txHash: string, content: string) => {
  const detail = (
    <div>
      <span>{content}</span>
      <TextLink href={`${url}/tx/${txHash}`} className="block !text-bc-blue">
        View Transaction
      </TextLink>
    </div>
  );
  return openNotification({ detail, title: 'Transaction Success' });
};

export const openTxPendingNotification = (url: string, txHash: string, content: string) => {
  const detail = (
    <div>
      <span>{content}</span>
      <TextLink href={`${url}/tx/${txHash}`} className="block !text-bc-blue">
        View Transaction
      </TextLink>
    </div>
  );
  return openNotification({ detail, title: 'Transaction pending' });
};

export const openTxErrorNotification = (url: string, txHash: string, content: string) => {
  const detail = (
    <div>
      <span>{content}:</span>
      <TextLink href={`${url}/tx/${txHash}`} className="block !text-bc-blue">
        View Transaction
      </TextLink>
    </div>
  );
  return openNotification({ type: 'error', detail, title: 'Transaction Failed' });
};

export default openNotification;
