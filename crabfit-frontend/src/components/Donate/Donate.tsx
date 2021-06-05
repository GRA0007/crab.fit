import { useState, useEffect, useRef } from 'react';
import { Button } from 'components';
import { useTWAStore } from 'stores';
import { useTranslation } from 'react-i18next';

import {
  Wrapper,
  Options,
} from './donateStyle';

import paypal_logo from 'res/paypal.svg';

const PAYMENT_METHOD = 'https://play.google.com/billing';
const SKU = 'crab_donation';

const Donate = () => {
  const store = useTWAStore();
  const { t } = useTranslation('common');

  const firstLinkRef = useRef();
  const buttonRef = useRef();
  const modalRef = useRef();
  const [isOpen, _setIsOpen] = useState(false);

  const setIsOpen = open => {
    _setIsOpen(open);

    if (open) {
      window.setTimeout(() => firstLinkRef.current.focus(), 150);
    }
  };

  const linkPressed = () => {
    setIsOpen(false);
    gtag('event', 'donate', { 'event_category': 'donate' });
  };

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
  	<Wrapper>
			<Button
				small
        title={t('donate.title')}
        onClick={event => {
          if (store.TWA) {
            gtag('event', 'donate', { 'event_category': 'donate' });
            event.preventDefault();
            if (window.confirm(t('donate.messages.about'))) {
              if (purchase() === false) {
                alert(t('donate.messages.error'));
              }
            }
          } else {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
        href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=5"
        target="_blank"
        rel="noreferrer"
        ref={buttonRef}
			>{t('donate.button')}</Button>

      <Options
        isOpen={isOpen}
        ref={modalRef}
        onBlur={e => {
          if (modalRef.current.contains(e.relatedTarget)) return;
          setIsOpen(false);
        }}
      >
        <img src={paypal_logo} alt="Donate with PayPal" />
        <a onClick={linkPressed} ref={firstLinkRef} href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=2" target="_blank" rel="noreferrer">{t('donate.options.$2')}</a>
        <a onClick={linkPressed} href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=5" target="_blank" rel="noreferrer"><strong>{t('donate.options.$5')}</strong></a>
        <a onClick={linkPressed} href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD&amount=10" target="_blank" rel="noreferrer">{t('donate.options.$10')}</a>
        <a onClick={linkPressed} href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD" target="_blank" rel="noreferrer">{t('donate.options.choose')}</a>
      </Options>
  	</Wrapper>
  );
}

export default Donate;
