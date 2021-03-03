import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

import {
	Center,
	Donate,
	TextField,
	SelectField,
	Button,
	Legend,
	AvailabilityViewer,
	AvailabilityEditor,
} from 'components';

import {
	StyledMain,
	Footer,
	Logo,
	Title,
	EventName,
	LoginForm,
	LoginSection,
	Info,
	ShareInfo,
	Tabs,
	Tab,
} from './eventStyle';

import logo from 'res/logo.svg';
import timezones from 'res/timezones.json';

const Event = (props) => {
	const { register, handleSubmit } = useForm();
	const id = props.match.params.id;
	const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
	const [user, setUser] = useState({
		name: 'Benji',
		availability: [],
	});
	const [tab, setTab] = useState(user ? 'you' : 'group');

	const onSubmit = data => console.log('submit', data);

	return (
		<>
			<StyledMain>
				<Link to="/" style={{ textDecoration: 'none' }}>
					<Center>
						<Logo src={logo} alt="" />
						<Title>CRAB FIT</Title>
					</Center>
				</Link>

				<EventName>Event name ({id})</EventName>
				<ShareInfo>https://page.url</ShareInfo>
				<ShareInfo>Copy the link to this page, or share via <a href="#test">Email</a> or <a href="#test">Facebook</a>.</ShareInfo>
			</StyledMain>

			<LoginSection id="login">
				<StyledMain>
					{!user && (
						<>
							<h2>Sign in to add your availability</h2>
							<LoginForm onSubmit={handleSubmit(onSubmit)}>
								<TextField
									label="Your name"
									type="text"
									name="name"
									id="name"
									inline
									required
									register={register}
								/>

								<TextField
									label="Password (optional)"
									type="password"
									name="password"
									id="password"
									inline
									register={register}
								/>

								<Button
								>Login</Button>
							</LoginForm>
							<Info>These details are only for this event. Use a password to prevent others from changing your availability.</Info>
						</>
					)}

					<SelectField
						label="Your time zone"
						name="timezone"
						id="timezone"
						inline
						value={timezone}
						onChange={value => setTimezone(value)}
						options={timezones}
					/>
				</StyledMain>
			</LoginSection>

			<StyledMain>
				<Tabs>
					<Tab
						href="#you"
						onClick={e => {
							e.preventDefault();
							if (user) {
								setTab('you');
							}
						}}
						selected={tab === 'you'}
						disabled={!user}
						title={user ? '' : 'Login to set your availability'}
					>Your availability</Tab>
					<Tab
						href="#group"
						onClick={e => {
							e.preventDefault();
							setTab('group');
						}}
						selected={tab === 'group'}
					>Group availability</Tab>
				</Tabs>
			</StyledMain>

			{tab === 'group' ? (
				<section id="group">
					<StyledMain>
						<Legend min={0} max={3} />
						<Center>Hover or tap the calendar below to see who is available</Center>
					</StyledMain>
					<AvailabilityViewer
						dates={['03032021', '04032021', '05032021', '07032021', '08032021']}
						times={['0900', '0915', '0930', '0945', '1000', '1015', '1030', '1045', '1100', '1115', '1130', '1145', '1200', '1215', '1230', '1245', '1300', '1315', '1330', '1345', '1400', '1415', '1430', '1445', '1500', '1515', '1530', '1545', '1600', '1615', '1630', '1645']}
						people={[{
							name: 'James',
							availability: [
								'0900-04032021',
								'0915-04032021',
								'0930-04032021',
								'0945-04032021',
								'1000-04032021',
								'1500-04032021',
								'1515-04032021',
								'1230-07032021',
								'1245-07032021',
								'1300-07032021',
								'1315-07032021',
								'1400-08032021',
								'1430-08032021',
							],
						},{
							name: 'Phoebe',
							availability: [
								'1100-07032021',
								'1115-07032021',
								'1130-07032021',
								'1145-07032021',
								'1200-07032021',
								'1215-07032021',
								'1230-07032021',
								'1245-07032021',
								'1300-07032021',
								'1315-07032021',
								'1330-07032021',
								'1345-07032021',
								'1400-07032021',
							],
						},user]}
					/>
				</section>
			) : (
				<section id="you">
					<StyledMain>
						<Center>Click and drag the calendar below to set your availabilities</Center>
					</StyledMain>
					<AvailabilityEditor
						dates={['03032021', '04032021', '05032021', '07032021', '08032021']}
						times={['0900', '0915', '0930', '0945', '1000', '1015', '1030', '1045', '1100', '1115', '1130', '1145', '1200', '1215', '1230', '1245', '1300', '1315', '1330', '1345', '1400', '1415', '1430', '1445', '1500', '1515', '1530', '1545', '1600', '1615', '1630', '1645']}
						value={user.availability}
						onChange={availability => setUser({ ...user, availability })}
					/>
				</section>
			)}

			<Footer id="donate">
				<span>Thank you for using Crab Fit. If you like it, consider donating.</span>
				<Donate />
			</Footer>
		</>
	);
};

export default Event;
