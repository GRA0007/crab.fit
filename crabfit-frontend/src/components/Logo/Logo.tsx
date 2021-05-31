import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import {
  Wrapper,
  A,
  Top,
  Image,
  Title,
  Tagline,
} from './logoStyle';

import image from 'res/logo.svg';

const Logo = () => {
  const { t } = useTranslation('common');

  return (
    <Wrapper>
      <A as={Link} to="/">
        <Top>
          <Image src={image} alt="" />
          <Title>CRAB FIT</Title>
        </Top>
        <Tagline>{t('common:tagline')}</Tagline>
      </A>
    </Wrapper>
  );
};

export default Logo;
