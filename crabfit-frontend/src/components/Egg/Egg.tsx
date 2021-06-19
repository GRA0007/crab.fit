import { useState } from 'react';

import { Loading } from 'components';
import { Image, Wrapper } from './eggStyle';

const Egg = ({ eggKey, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Wrapper title="Click anywhere to close" onClick={() => onClose()}>
      <Image
        src={`https://us-central1-flour-app-services.cloudfunctions.net/charliAPI?v=${eggKey}`}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />
      {isLoading && <Loading />}
    </Wrapper>
  );
}

export default Egg;
