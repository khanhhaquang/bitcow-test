import classNames from 'classnames';
import { Layout } from 'components/Antd';
import useCurrentPage from 'hooks/useCurrentPage';
import { Link } from 'react-router-dom';

import { DiscordIcon, DocIcon, LogoIcon, MediumIcon, TwitterIcon } from 'resources/icons';

const { Footer } = Layout;

const URLs = {
  discord: 'https://discord.gg/f7qFxfJWMX',
  github: 'https://github.com/hippospace',
  docs: 'https://hippo-labs.gitbook.io/dev/',
  medium: 'https://medium.com/@hippolabs',
  twitter: 'https://twitter.com/hippolabs__'
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
    <div className="flex items-center gap-10 laptop:justify-center laptop:w-full">
      <ExternalLink href={URLs.medium}>
        <MediumIcon />
      </ExternalLink>
      <ExternalLink href={URLs.discord}>
        <DiscordIcon />
      </ExternalLink>
      <ExternalLink href={URLs.docs}>
        <DocIcon />
      </ExternalLink>
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
      className={classNames('flex justify-between bg-transparent z-10', {
        'py-10 px-20 laptop:pb-24 laptop:pt-5': currentPageName === 'Home',
        'border-t-[1px] border-gray_02 py-5 px-15': currentPageName !== 'Home'
      })}>
      {currentPageName === 'Home' && (
        <Link to="/" className="h-full flex items-center justify-center laptop:hidden">
          <LogoIcon className="w-[120px] mobile:hidden tablet:block" />
        </Link>
      )}
      <SocialBtnGroups />
      {currentPageName !== 'Home' && (
        <div className="font-Furore text-lg h-full flex cursor-pointer justify-center items-center text-color_main">
          {'Contact us'}
        </div>
      )}
    </Footer>
  );
};

export default PageFooter;
