import { useRive } from '@rive-app/react-canvas';
import { Image } from 'antd';
import useCurrentPage from 'hooks/useCurrentPage';

const AppPageDecorators = () => {
  const [currentPageName] = useCurrentPage();
  const { RiveComponent: SmallCloudRive } = useRive({
    src: '/riv/small-cloud.riv',
    stateMachines: 'State Machine 1',
    autoplay: true
  });

  const { RiveComponent: BigCloudRive } = useRive({
    src: '/riv/big-cloud.riv',
    stateMachines: 'State Machine 1',
    autoplay: true
  });

  if (!['Swap', 'Pools'].includes(currentPageName)) return null;

  return (
    <>
      <Image
        src="/images/clouds/cloud1.webp"
        width={98}
        height={55}
        rootClassName="absolute top-1/2 left-1/4"
      />
      <Image
        src="/images/clouds/cloud2.webp"
        width={65}
        height={23}
        rootClassName="absolute top-2/3 left-[100px]"
      />
      <Image
        src="/images/clouds/cloud3.webp"
        className=" top-4"
        width={65}
        height={23}
        rootClassName="absolute top-3/4 left-1/2"
      />
      <Image
        src="/images/clouds/cloud4.webp"
        width={262}
        height={87}
        rootClassName="absolute right-0 top-1/3"
      />

      <div className="absolute -left-1 top-1/3 h-[200px] w-[350px]">
        <SmallCloudRive />
      </div>

      <div className="absolute top-1/2 right-[15%] h-[300px] w-[400px]">
        <BigCloudRive />
      </div>
    </>
  );
};

export default AppPageDecorators;
