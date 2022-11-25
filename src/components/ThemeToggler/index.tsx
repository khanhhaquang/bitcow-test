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
              'h-[30px] w-full rounded-[30px] bg-color_bg_input px-3 py-2 text-sm leading-[14px] text-color_text_1',
              {
                'text-left': theme === Theme.Dark,
                'text-right': theme === Theme.Light
              }
            )}>
            {theme === Theme.Dark ? 'Light' : 'Dark'}
          </div>
          <Button
            className={cx(
              'absolute top-1/2 h-[34px] w-[34px] -translate-y-1/2 rounded-full border-[1px] border-gray_01 fill-white p-0 transition-all',
              {
                'left-0 bg-color_main': theme === Theme.Light,
                'left-[57px] bg-color_bg_tooltip': theme === Theme.Dark
              }
            )}>
            {theme === Theme.Dark ? <MoonMobileIcon /> : <SunIcon />}
          </Button>
        </div>
      ) : (
        <Button
          className={cx('h-10 w-10 rounded-full fill-color_text_1 p-0', {
            'hover:bg-gray_016': theme === Theme.Dark,
            'shadow-none bg-transparent hover:shadow-md': theme === Theme.Light
          })}
          onClick={toggleTheme}>
          {theme === Theme.Dark ? <SunIcon /> : <MoonIcon />}
        </Button>
      )}
    </Fragment>
  );
};

export default ThemeToggler;
