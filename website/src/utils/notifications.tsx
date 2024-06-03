import { ReactNode } from 'react';

import { notification } from 'components/Antd';
import TextLink from 'components/TextLink';
import { NotiErrorIcon, HintIcon, NotiSuccessIcon, CloseIcon } from 'resources/icons';
import { getChainTxnUrl } from './formatter';

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
    icon = <NotiErrorIcon className="text-[#FF1F00]" />;
  } else if (type === 'info') {
    icon = <HintIcon />;
  } else if (type === 'warn') {
    icon = <NotiErrorIcon className="text-[#FF8D00]" />;
  }

  // DUE TO THE SPACING OF TOP HIGHLIGHT LUCKY COW
  // PLUS 40px
  const top = window.location.pathname.startsWith('/lucky-cow') ? 220 : 180;

  notification.open({
    message: title,
    description: detail,
    placement: 'topRight',
    icon,
    className: `obric-notification obric-notification--${type}`,
    closeIcon: <CloseIcon className="bottom-1 h-full w-full text-white/60" />,
    top,
    duration: 6
  });
};

const renderTxnView = (content: ReactNode, txnUrl) => {
  return (
    <p className="flex flex-wrap">
      {content}
      {!!txnUrl && (
        <TextLink href={txnUrl} className="ml-1 !text-bc-blue">
          here
        </TextLink>
      )}
    </p>
  );
};

export const openErrorNotification = (args: INotificationArgs) =>
  openNotification({ type: 'error', ...args });

export const openTxSuccessNotification = (url: string, txHash: string, content: string) => {
  const detail = renderTxnView(content, getChainTxnUrl(url, txHash));
  return openNotification({ detail, title: 'Transaction Success' });
};

export const openTxPendingNotification = (content: string, url = '', txHash = '') => {
  const detail = renderTxnView(content, getChainTxnUrl(url, txHash));
  return openNotification({ detail, type: 'warn', title: 'Transaction processing...' });
};

export const openTxErrorNotification = (url: string, txHash: string, content: string) => {
  const detail = renderTxnView(content, getChainTxnUrl(url, txHash));
  return openNotification({ type: 'error', detail, title: 'Transaction Failed' });
};

export default openNotification;
