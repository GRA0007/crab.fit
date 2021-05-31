import { useTranslation } from 'react-i18next';

import { Donate } from 'components';
import { Wrapper } from './footerStyle';

const Footer = (props) => {
  const { t } = useTranslation('common');

  return (
    <Wrapper id="donate" {...props}>
      <span>{t('donate.info')}</span>
      <Donate />
    </Wrapper>
  );
};

export default Footer;
