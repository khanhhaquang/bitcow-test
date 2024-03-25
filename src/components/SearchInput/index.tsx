import cx from 'classnames';

import { Input } from 'components/Antd';
import { SearchIcon } from 'resources/icons';

// import styles from './SearchInput.module.scss';

interface IProps {
  onChange: (val: string) => void;
  value: string;
  onSearch: () => void;
  className?: string;
}

const SearchInput = ({ onChange, value, onSearch, className }: IProps) => {
  const handleOnChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={cx('searchInput', className)}>
      <Input
        suffix={<SearchIcon className="fill-bc-white-60 tablet:w-6" />}
        placeholder={'Search Pools'}
        value={value}
        onChange={handleOnChange}
        onPressEnter={() => onSearch}
      />
    </div>
  );
};

export default SearchInput;
