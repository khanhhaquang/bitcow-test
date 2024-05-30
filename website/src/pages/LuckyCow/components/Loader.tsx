import { Image } from 'antd';
import { FC, ReactNode } from 'react';

type LoaderProps = {
  children?: ReactNode;
};

const Loader: FC<LoaderProps> = ({ children }) => {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center gap-3 font-pdb text-lg text-black">
        <Image src="/images/cow-loading.webp" alt="loading" width={203} height={103} />
        {children || 'The LUCKY COW is working on it...'}
      </div>
    </div>
  );
};

export default Loader;
