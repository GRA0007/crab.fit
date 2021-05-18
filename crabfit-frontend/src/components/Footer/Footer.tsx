import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Donate } from 'components';
import { Wrapper, Link } from './footerStyle';

const Footer = () => {
  const [donateMode, setDonateMode] = useState(false);
  const { t } = useTranslation('common');

  return (
    <Wrapper id="donate" donateMode={donateMode}>
      {donateMode ? (
        <>
          <Link href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=2" target="_blank">{t('donate.options.$2')}</Link>
          <Link href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=5" target="_blank"><strong>{t('donate.options.$5')}</strong></Link>
          <Link href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=10" target="_blank">{t('donate.options.$10')}</Link>
          <Link href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD" target="_blank">{t('donate.options.choose')}</Link>
        </>
      ) : (
        <>
          <span>{t('donate.info')}</span>
          <Donate onDonate={() => setDonateMode(true)} />
        </>
      )}
    </Wrapper>
  );
};

export default Footer;
