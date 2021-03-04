import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import {
	TextField,
	CalendarField,
	TimeRangeField,
	SelectField,
	Button,
	Center,
	Donate,
	Error,
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
	Stats,
	Stat,
	StatNumber,
	StatLabel,
} from './homeStyle';

import api from 'services';

import logo from 'res/logo.svg';
import timezones from 'res/timezones.json';

dayjs.extend(utc);
dayjs.extend(timezone);

const Home = () => {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		},
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [stats, setStats] = useState({
		eventCount: null,
		personCount: null,
		version: 'loading...',
	});
	const { push } = useHistory();

	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await api.get('/stats');
				setStats(response.data);
			} catch (e) {
				console.error(e);
			}
		};

		fetch();
	}, []);

	const onSubmit = async data => {
		setIsLoading(true);
		setError(null);
		try {
			const times = JSON.parse(data.times);
			const dates = JSON.parse(data.dates);

			const start = dayjs().tz(data.timezone).hour(times.start);
			const end = dayjs().tz(data.timezone).hour(times.end);

			const response = await api.post('/event', {
				event: {
					name: data.name,
					startTime: start.utc().hour(),
					endTime: end.utc().hour(),
					dates: dates,
				},
			});
			push(`/${response.data.id}`);
		} catch (e) {
			setError('An error ocurred while creating the event. Please try again later.');
			console.error(e);
		} finally {
			setIsLoading(false);
		}
	};

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
						required
						register={register}
					/>

					<TimeRangeField
						label="What times might work?"
						subLabel="Click and drag to select a time range"
						name="times"
						id="times"
						required
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

					{error && (
						<Error onClose={() => setError(null)}>{error}</Error>
					)}

					<Center>
						<Button type="submit" isLoading={isLoading} disabled={isLoading}>Create</Button>
					</Center>
				</CreateForm>
			</StyledMain>

			<AboutSection id="about">
				<StyledMain>
					<h2>About Crab Fit</h2>
					<Stats>
						<Stat>
							<StatNumber>{stats.eventCount ?? '10+'}</StatNumber>
							<StatLabel>Events created</StatLabel>
						</Stat>
						<Stat>
							<StatNumber>{stats.peopleCount ?? '10+'}</StatNumber>
							<StatLabel>Availabilities entered</StatLabel>
						</Stat>
					</Stats>
					<P>Crab Fit helps you fit your event around everyone's schedules. Simply create an event above and send the link to everyone that is participating. Results update live and you will be able to see a heat-map of when everyone is free.</P>
					{/* eslint-disable-next-line */}
					<P>Created by <a href="https://bengrant.dev" target="_blank">Ben Grant</a>, Crab Fit is the modern-day solution to your group event planning debates.</P>
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
