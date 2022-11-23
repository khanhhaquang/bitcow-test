import cx from 'classnames';
import { Fragment } from 'react';

import Button from 'components/Button';
import { Theme } from 'contexts/GlobalSettingProvider';
import { useBreakpoint } from 'hooks/useBreakpoint';
import useGlobalSetting from 'hooks/useGlobalSetting';
import { MoonIcon, MoonMobileIcon, SunIcon } from 'resources/icons';

const ThemeToggler = () => {
  const { isTablet } = useBreakpoint('tablet');
  const { theme, setTheme } = useGlobalSetting();

  const toggleTheme = () => setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark);

  return (
    <Fragment>
      {isTablet ? (
        <div className={'relative flex w-[87px] cursor-pointer items-center'} onClick={toggleTheme}>
          <div
            className={cx(
              'h-[30px] w-full rounded-[30px] bg-white_table px-3 py-2 text-sm leading-[14px] dark:bg-color_bg_input',
              {
                'text-left text-white': theme === Theme.Dark,
                'text-right text-item_black': theme === Theme.Light
              }
            )}>
            {theme === Theme.Dark ? 'Light' : 'Dark'}
          </div>
          <Button
            className={cx(
              'absolute top-1/2 h-[34px] w-[34px] -translate-y-1/2 rounded-full fill-white p-0 transition-all',
              {
                'left-0 bg-color_main': theme === Theme.Light,
                'left-[57px] bg-color_border': theme === Theme.Dark
              }
            )}>
            {theme === Theme.Dark ? <MoonMobileIcon /> : <SunIcon />}
          </Button>
        </div>
      ) : (
        <Button
          className={cx('h-10 w-10 rounded-full p-0', {
            'fill-white hover:bg-gray_016': theme === Theme.Dark,
            'shadow-none bg-transparent fill-item_black hover:shadow-md': theme === Theme.Light
          })}
          onClick={toggleTheme}>
          {theme === Theme.Dark ? <SunIcon /> : <MoonIcon />}
        </Button>
      )}
    </Fragment>
  );
};

export default ThemeToggler;
