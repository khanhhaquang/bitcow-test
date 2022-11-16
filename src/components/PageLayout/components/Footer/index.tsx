import classNames from 'classnames';
import { Link } from 'react-router-dom';

import { Layout } from 'components/Antd';
import useCurrentPage from 'hooks/useCurrentPage';
import { DiscordIcon, LogoIcon, TwitterIcon } from 'resources/icons';

const { Footer } = Layout;

const URLs = {
  discord: 'https://discord.gg/TNXY8Xd7bH',
  twitter: 'https://twitter.com/poor_obric'
};

const ExternalLink = ({ href, children }: { href: string; children: any }) => {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={href}
      className="flex fill-gray_05 hover:fill-color_main">
      {children}
    </a>
  );
};

const SocialBtnGroups = () => {
  return (
    <div className="flex items-center gap-10 laptop:w-full laptop:justify-center">
      {/* <ExternalLink href={URLs.medium}>
        <MediumIcon />
      </ExternalLink> */}
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

const PageFooter: React.FC = () => {
  const [currentPageName] = useCurrentPage();

  return (
    <Footer
      className={classNames('z-10 flex justify-between bg-transparent', {
        'py-10 px-20 laptop:pb-24 laptop:pt-5': currentPageName === 'Home',
        'px-15 border-t-[1px] border-gray_02 py-5': currentPageName !== 'Home'
      })}>
      {currentPageName === 'Home' && (
        <Link to="/" className="flex h-full items-center justify-center laptop:hidden">
          <LogoIcon className="w-[120px]" />
        </Link>
      )}
      {currentPageName !== 'Home' && <div className="block grow tablet:hidden" />}
      <SocialBtnGroups />
      {/* {currentPageName !== 'Home' && (
        <div className="block flex h-full cursor-pointer items-center justify-center font-Furore text-lg text-color_main laptop:hidden">
          {'Contact us'}
        </div>
      )} */}
    </Footer>
  );
};

export default PageFooter;
