import classNames from 'classnames';
import { Fragment } from 'react';

import { Layout } from 'components/Antd';
import { DocsIcon, TwitterIcon, DiscordIcon } from 'resources/icons';

const { Footer } = Layout;

const URLs = {
  doc: 'https://bitcow.gitbook.io/amm',
  discord: '',
  twitter: 'https://twitter.com/bitCow_AMM'
};

const ExternalLink = ({ href, children }: { href: string; children: any }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      className="flex fill-color_text_2 hover:!fill-color_main">
      {children}
    </a>
  );
};

const SocialBtnGroups = () => {
  return (
    <div className="flex items-center gap-10 tablet:w-full tablet:justify-center">
      {/* <ExternalLink href={URLs.medium}>
        <MediumIcon />
      </ExternalLink>
      <ExternalLink href={URLs.doc}>
        <DocFilledIcon />
      </ExternalLink>  */}
      <ExternalLink href={URLs.twitter}>
        <TwitterIcon />
      </ExternalLink>
      <ExternalLink href={URLs.discord}>
        <DiscordIcon className="text-bc-white" />
      </ExternalLink>
      <ExternalLink href={URLs.doc}>
        <DocsIcon className="text-bc-white" />
      </ExternalLink>
    </div>
  );
};

interface TProps {
  className?: string;
}

const PageFooter: React.FC<TProps> = ({ className }) => {
  return (
    <Fragment>
      <Footer
        className={classNames(
          'z-10 flex justify-between bg-transparent tablet:flex-col-reverse tablet:items-center tablet:gap-y-2 tablet:pb-12 tablet:pt-24',
          className
        )}>
        <img
          className="mr-auto tablet:mr-0"
          src="/images/copyright.png"
          width={306}
          height={25}
          alt="copyright"
        />
        <SocialBtnGroups />
      </Footer>
    </Fragment>
  );
};

export default PageFooter;
