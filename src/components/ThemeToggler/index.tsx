import cx from 'classnames';
import { Fragment } from 'react';

import { Switch } from 'components/Antd';
import Button from 'components/Button';
import { Theme } from 'contexts/GlobalSettingProvider';
import { useBreakpoint } from 'hooks/useBreakpoint';
import useGlobalSetting from 'hooks/useGlobalSetting';
import { MoonIcon, SunIcon } from 'resources/icons';

import styles from './ThemeToggler.module.scss';

const ThemeToggler = () => {
  const { isTablet } = useBreakpoint('tablet');
  const { theme, setTheme } = useGlobalSetting();
  return (
    <Fragment>
      {isTablet ? (
        <div className={cx(styles.switchMobile, 'w-[34px]')}>
          <Switch
            checkedChildren="Light"
            unCheckedChildren="Dark"
            checked={theme === Theme.Dark}
            onChange={(checked: boolean) => setTheme(checked ? Theme.Dark : Theme.Light)}
          />
        </div>
      ) : (
        <Button
          className={cx('h-10 w-10 rounded-full p-0', {
            'bg-gray_016 fill-white opacity-30 hover:opacity-100': theme === Theme.Dark,
            'shadow-none bg-transparent fill-item_black hover:shadow-md': theme === Theme.Light
          })}
          onClick={() => setTheme(theme === Theme.Dark ? Theme.Light : Theme.Dark)}>
          {theme === 'Dark' ? <SunIcon /> : <MoonIcon />}
        </Button>
      )}
    </Fragment>
  );
};

export default ThemeToggler;
