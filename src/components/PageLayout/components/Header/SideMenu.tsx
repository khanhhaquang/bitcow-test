import { routes, TRoute } from 'App.routes';
import classNames from 'classnames';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from 'components/Button';

interface ISideMenuProps {
  currentPageName: TRoute['name'];
  onRouteSelected: () => void;
}

const SideMenu = ({ currentPageName, onRouteSelected }: ISideMenuProps) => {
  const navigate = useNavigate();
  const onRoute = useCallback(
    (path: string | undefined) => {
      navigate(path || '/');
      onRouteSelected();
    },
    [navigate, onRouteSelected]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="w-full space-y-4">
        {routes
          .filter((r) => r.path !== '*' && !r.hidden)
          .map(({ name, path }) => {
            const isCurrent = currentPageName === name;
            return (
              <Button
                key={`${name}-${isCurrent}`}
                className={classNames('w-full', { 'hip-btn-selected': isCurrent })}
                variant={'outlined'}
                onClick={() => onRoute(path)}>
                {name}
              </Button>
            );
          })}
      </div>
    </div>
  );
};

export default SideMenu;
