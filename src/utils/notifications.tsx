import { MaybeHexString } from 'aptos';
import { notification } from 'components/Antd';
import TextLink from 'components/TextLink';
import { ReactNode } from 'react';
import { CancelIcon, NotiErrorIcon, HintIcon, NotiSuccessIcon } from 'resources/icons';

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
    icon = <NotiErrorIcon className="fill-color_error" />;
  } else if (type === 'info') {
    icon = <HintIcon />;
  }

  notification.open({
    message: title,
    description: detail,
    placement: 'topRight',
    icon,
    className: `obric-notification obric-notification--${type}`,
    closeIcon: <CancelIcon className="w-full h-full" />,
    top: 84,
    duration: 6
  });
};

export const openErrorNotification = (args: INotificationArgs) =>
  openNotification({ type: 'error', ...args });

export const openTxSuccessNotification = (txHash: MaybeHexString, content: string) => {
  const detail = (
    <p>
      <div>{content}</div>
      <TextLink href={`https://explorer.aptoslabs.com/txn/${txHash}`}>View transaction</TextLink>
    </p>
  );
  return openNotification({ detail, title: 'Transaction Success' });
};

export default openNotification;
