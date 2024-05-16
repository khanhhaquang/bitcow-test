import { useRive } from '@rive-app/react-canvas';
import { Image } from 'antd';

const AppPageDecorators = () => {
  const { RiveComponent: SmallCloudRive } = useRive({
    src: '/riv/small-cloud.riv',
    autoplay: true
  });

  const { RiveComponent: BigCloudRive } = useRive({
    src: '/riv/big-cloud.riv',
    autoplay: true
  });

  return (
    <>
      <Image
        src="/images/clouds/cloud1.webp"
        width={98}
        height={55}
        rootClassName="fixed top-1/2 left-1/4"
      />
      <Image
        src="/images/clouds/cloud2.webp"
        width={65}
        height={23}
        rootClassName="fixed top-2/3 left-[100px]"
      />
      <Image
        src="/images/clouds/cloud3.webp"
        className=" top-4"
        width={65}
        height={23}
        rootClassName="fixed top-3/4 left-1/2"
      />
      <Image
        src="/images/clouds/cloud4.webp"
        width={262}
        height={87}
        rootClassName="fixed right-0 top-1/3"
      />

      <div className="fixed -left-1 top-1/3 h-[200px] w-[350px]">
        <SmallCloudRive />
      </div>

      <div className="fixed top-1/2 right-[15%] h-[300px] w-[400px]">
        <BigCloudRive />
      </div>
    </>
  );
};

export default AppPageDecorators;
