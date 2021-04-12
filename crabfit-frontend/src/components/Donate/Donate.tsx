import { Button } from 'components';

const Donate = () => (
	<div style={{ marginTop: 6, marginLeft: 12 }}>
		<a onClick={() => gtag('event', 'donate', { 'event_category': 'donate' })} href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD" target="_blank" rel="noreferrer">
			<Button
				buttonHeight="30px"
				buttonWidth="90px"
				type="button"
				tabIndex="-1"
			>Donate</Button>
		</a>
	</div>
);

export default Donate;
