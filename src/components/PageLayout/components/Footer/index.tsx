import classNames from 'classnames';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { Layout } from 'components/Antd';
import useCurrentPage from 'hooks/useCurrentPage';
import { DiscordIcon, DocFilledIcon, LogoIcon, TwitterIcon } from 'resources/icons';
import FooterMobileBg from 'resources/img/footerMobileBg.png';
import FooterMobileWhiteBg from 'resources/img/footerMobileBgWhite.png';

const { Footer } = Layout;

const URLs = {
  doc: 'https://obricxyz.gitbook.io/smart/',
  discord: 'https://discord.gg/TNXY8Xd7bH',
  twitter: 'https://twitter.com/poor_obric'
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
      </ExternalLink> */}
      <ExternalLink href={URLs.doc}>
        <DocFilledIcon />
      </ExternalLink>
      <ExternalLink href={URLs.discord}>
        <DiscordIcon />
      </ExternalLink>
      {/* <ExternalLink href={URLs.docs}>
        <TelegramIcon />
      </ExternalLink> */}
      <ExternalLink href={URLs.twitter}>
        <TwitterIcon />
      </ExternalLink>
    </div>
  );
};

interface TProps {
  className?: string;
}

const PageFooter: React.FC<TProps> = ({ className }) => {
  const [currentPageName] = useCurrentPage();

  return (
    <Fragment>
      <div className="hidden w-full tablet:block">
        <img src={FooterMobileBg} alt="" className="hidden h-full w-full object-cover dark:block" />
        <img
          src={FooterMobileWhiteBg}
          alt=""
          className="block h-full w-full object-cover dark:hidden"
        />
      </div>
      <Footer
        className={classNames(
          'z-10 flex justify-between bg-transparent',
          {
            'py-10 px-20 tablet:pb-24 tablet:pt-5': currentPageName === 'Home',
            'px-15 py-5 tablet:border-none': currentPageName !== 'Home'
          },
          className
        )}>
        {currentPageName === 'Home' && (
          <Link to="/" className="flex h-full items-center justify-center tablet:hidden">
            <LogoIcon className="w-[120px]" />
          </Link>
        )}
        {currentPageName !== 'Home' && <div className="block grow tablet:hidden" />}
        <SocialBtnGroups />
        {/* {currentPageName !== 'Home' && (
          <div className="block flex h-full cursor-pointer items-center justify-center font-Furore text-lg text-color_main tablet:hidden">
            {'Contact us'}
          </div>
        )} */}
      </Footer>
    </Fragment>
  );
};

export default PageFooter;
