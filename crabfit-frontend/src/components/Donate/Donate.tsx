import { useEffect } from 'react';
import { Button } from 'components';
import { useTWAStore } from 'stores';

const PAYMENT_METHOD = 'https://play.google.com/billing';
const SKU = 'crab_donation';

const Donate = () => {
  const store = useTWAStore();

  useEffect(() => {
    if (store.TWA === undefined) {
      store.setTWA(document.referrer.includes('android-app://fit.crab'));
    }
  }, [store]);

  const acknowledge = async (token, type='repeatable', onComplete = () => {}) => {
    try {
      let service = await window.getDigitalGoodsService(PAYMENT_METHOD);
      await service.acknowledge(token, type);
      onComplete();
    } catch (error) {
      console.error(error);
    }
  }

  const purchase = () => {
    if (!window.PaymentRequest) return false;
    if (!window.getDigitalGoodsService) return false;

    const supportedInstruments = [{
      supportedMethods: PAYMENT_METHOD,
      data: {
        sku: SKU
      }
    }];

    const details = {
      total: {
        label: 'Total',
        amount: { currency: 'AUD', value: '0' }
      },
    };

    const request = new PaymentRequest(supportedInstruments, details);

    request.show()
      .then(response => {
        response
          .complete('success')
          .then(() => {
            console.log(`Payment done: ${JSON.stringify(response, undefined, 2)}`);
            if (response.details && response.details.token) {
              const token = response.details.token;
              console.log(`Read Token: ${token.substring(0, 6)}...`);
              alert('Thank you for your donation! Without you, Crab Fit wouldn\'t be free, so thank you and keep being super awesome!');
              acknowledge(token);
            }
          })
          .catch(e => {
            console.error(e.message);
            alert('Cannot make donation through Google. Please try donating through the website crab.fit 🦀');
          });
      })
      .catch(e => {
        console.error(e);
        alert('Cannot make donation through Google. Please try donating through the website crab.fit 🦀');
      });
  };

  return (
  	<div style={{ marginTop: 6, marginLeft: 12 }}>
  		<a
        onClick={event => {
          gtag('event', 'donate', { 'event_category': 'donate' });
          if (store.TWA) {
            event.preventDefault();
            if (window.confirm('Did you know that Crab Fit costs more that $100 per month? If it\'s helped you out at all, consider donating to help keep it running. 🦀')) {
              if (purchase() === false) {
                alert('Cannot make donation through Google. Please try donating through the website crab.fit 🦀');
              }
            }
          }
        }}
        href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD"
        target="_blank"
        rel="noreferrer"
      >
  			<Button
  				buttonHeight="30px"
  				buttonWidth="90px"
  				type="button"
  				tabIndex="-1"
          title="Every amount counts :)"
  			>Donate</Button>
  		</a>
  	</div>
  );
}

export default Donate;
