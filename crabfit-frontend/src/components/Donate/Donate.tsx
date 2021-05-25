import { useEffect } from 'react';
import { Button } from 'components';
import { useTWAStore } from 'stores';
import { useTranslation } from 'react-i18next';

const PAYMENT_METHOD = 'https://play.google.com/billing';
const SKU = 'crab_donation';

const Donate = ({ onDonate = null }) => {
  const store = useTWAStore();
  const { t } = useTranslation('common');

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
              alert(t('donate.messages.success'));
              acknowledge(token);
            }
          })
          .catch(e => {
            console.error(e.message);
            alert(t('donate.messages.error'));
          });
      })
      .catch(e => {
        console.error(e);
        alert(t('donate.messages.error'));
      });
  };

  return (
  	<div style={{ marginTop: 6, marginLeft: 12 }}>
  		<a
        onClick={event => {
          gtag('event', 'donate', { 'event_category': 'donate' });
          if (store.TWA) {
            event.preventDefault();
            if (window.confirm(t('donate.messages.about'))) {
              if (purchase() === false) {
                alert(t('donate.messages.error'));
              }
            }
          } else if (onDonate !== null) {
            event.preventDefault();
            onDonate();
          }
        }}
        href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=5"
        target="_blank"
        rel="noreferrer"
      >
  			<Button
  				buttonHeight="30px"
  				buttonWidth={`${Math.max(t('donate.button').length*10, 90)}px`}
  				type="button"
  				tabIndex="-1"
          title={t('donate.title')}
  			>{t('donate.button')}</Button>
  		</a>
  	</div>
  );
}

export default Donate;
