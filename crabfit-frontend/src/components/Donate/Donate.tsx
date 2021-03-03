import { Button } from 'components';

const Donate = () => (
	<div style={{ marginTop: 6, marginLeft: 12 }}>
		<a href="https://www.paypal.com/donate?business=N89X6YXRT5HKW&item_name=Crab+Fit+Donation&currency_code=AUD" target="_blank" rel="noreferrer">
			<Button
				buttonHeight="30px"
				buttonWidth="90px"
				type="button"
			>Donate</Button>
		</a>
	</div>
);

export default Donate;
