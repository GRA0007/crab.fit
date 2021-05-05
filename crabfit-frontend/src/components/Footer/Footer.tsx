import { useState } from 'react';

import { Donate } from 'components';
import { Wrapper, Link } from './footerStyle';

const Footer = () => {
  const [donateMode, setDonateMode] = useState(false);

  return (
    <Wrapper id="donate" donateMode={donateMode}>
      {donateMode ? (
        <>
          <Link href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=2" target="_blank">Donate $2</Link>
          <Link href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=5" target="_blank"><strong>Donate $5</strong></Link>
          <Link href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=10" target="_blank">Donate $10</Link>
          <Link href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD" target="_blank">Choose an amount</Link>
        </>
      ) : (
        <>
          <span>Thank you for using Crab Fit. If you like it, consider donating.</span>
          <Donate onDonate={() => setDonateMode(true)} />
        </>
      )}
    </Wrapper>
  );
};

export default Footer;
