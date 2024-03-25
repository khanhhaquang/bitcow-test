import { ReactNode } from 'react';

import { notification } from 'components/Antd';
import TextLink from 'components/TextLink';
import { NotiErrorIcon, HintIcon, NotiSuccessIcon } from 'resources/icons';
import { ReactComponent as PixelCloseIcon } from 'resources/icons/pixelClose.svg';

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
    closeIcon: <PixelCloseIcon className="h-full w-full" />,
    top: 160,
    duration: 6
  });
};

export const openErrorNotification = (args: INotificationArgs) =>
  openNotification({ type: 'error', ...args });

export const openTxSuccessNotification = (txHash: string, content: string) => {
  const detail = (
    <div>
      <div>{content}</div>
      <TextLink href={`https://testnet-scan.merlinchain.io/tx/${txHash}`} className="!text-bc-blue">
        View on Explorer
      </TextLink>
    </div>
  );
  return openNotification({ detail, title: 'Transaction Success' });
};

export const openTxErrorNotification = (txHash: string, content: string) => {
  const detail = (
    <div>
      <div>{content}</div>
      <TextLink href={`https://testnet-scan.merlinchain.io/tx/${txHash}`} className="!text-bc-blue">
        View on Explorer
      </TextLink>
    </div>
  );
  return openNotification({ type: 'error', detail, title: 'Transaction Failed' });
};

export default openNotification;
