import { useForm } from 'react-hook-form';

import {
	TextField,
	CalendarField,
	TimeRangeField,
	SelectField,
	Button,
	Center,
	Donate,
} from 'components';

import {
	StyledMain,
	CreateForm,
	TitleSmall,
	TitleLarge,
	Logo,
	Links,
	AboutSection,
	Footer,
	P,
} from './homeStyle';

import logo from 'res/logo.svg';
import timezones from 'res/timezones.json';

const Home = () => {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		},
	});

	const onSubmit = data => console.log('submit', data);

	return (
		<>
			<StyledMain>
				<Center>
					<Logo src={logo} alt="" />
				</Center>
				<TitleSmall>Create a</TitleSmall>
				<TitleLarge>CRAB FIT</TitleLarge>
				<Links>
					<a href="#about">About</a> / <a href="#donate">Donate</a>
				</Links>

				<CreateForm onSubmit={handleSubmit(onSubmit)} id="create">
					<TextField
						label="Give your event a name!"
						subLabel="Or leave blank to generate one"
						type="text"
						name="name"
						id="name"
						register={register}
					/>

					<CalendarField
						label="What dates might work?"
						subLabel="Click and drag to select"
						name="dates"
						id="dates"
						register={register}
					/>

					<TimeRangeField
						label="What times might work?"
						subLabel="Click and drag to select a time range"
						name="times"
						id="times"
						register={register}
					/>

					<SelectField
						label="And the timezone"
						name="timezone"
						id="timezone"
						register={register}
						options={timezones}
						required
					/>

					<Center>
						<Button type="submit">Create</Button>
					</Center>
				</CreateForm>
			</StyledMain>

			<AboutSection id="about">
				<StyledMain>
					<h2>About Crab Fit</h2>
					<P>Crab Fit helps you fit your event around everyone's schedules. Simply create an event above and send the link to everyone that is participating. Results update live and you will be able to see a heat-map of when everyone is free.</P>
					{/* eslint-disable-next-line */}
					<P>Create by <a href="https://bengrant.dev" target="_blank">Ben Grant</a>, Crab Fit is the modern-day solution to your group event planning debates.</P>
					<P>The code for Crab Fit is open source, if you find any issues or want to contribute, you can visit the <a href="https://github.com/GRA0007/crab.fit" target="_blank" rel="noreferrer">repository</a>.</P>
				</StyledMain>
			</AboutSection>

			<Footer id="donate">
				<span>Thank you for using Crab Fit. If you like it, consider donating.</span>
				<Donate />
			</Footer>
		</>
	);
};

export default Home;
