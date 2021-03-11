import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

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
dayjs.extend(customParseFormat);

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
		document.title = 'Crab Fit';
	}, []);

	const onSubmit = async data => {
		setIsLoading(true);
		setError(null);
		try {
			const { start, end } = JSON.parse(data.times);
			const dates = JSON.parse(data.dates);

			if (dates.length === 0) {
				return setError(`You haven't selected any dates!`);
			}
      const isSpecificDates = typeof dates[0] === 'string' && dates[0].length === 8;
			if (start === end) {
				return setError(`The start and end times can't be the same`);
			}

			let times = dates.reduce((times, date) => {
				let day = [];
				for (let i = start; i < (start > end ? 24 : end); i++) {
          if (isSpecificDates) {
  					day.push(
  						dayjs.tz(date, 'DDMMYYYY', data.timezone)
  						.hour(i).minute(0).utc().format('HHmm-DDMMYYYY')
  					);
          } else {
            day.push(
              dayjs().tz(data.timezone)
              .day(date).hour(i).minute(0).utc().format('HHmm-d')
            );
          }
				}
				if (start > end) {
					for (let i = 0; i < end; i++) {
            if (isSpecificDates) {
    					day.push(
    						dayjs.tz(date, 'DDMMYYYY', data.timezone)
    						.hour(i).minute(0).utc().format('HHmm-DDMMYYYY')
    					);
            } else {
              day.push(
                dayjs().tz(data.timezone)
                .day(date).hour(i).minute(0).utc().format('HHmm-d')
              );
            }
					}
				}
				return [...times, ...day];
			}, []);

      return console.log(times);

			if (times.length === 0) {
				return setError(`You don't have any time selected`);
			}

			const response = await api.post('/event', {
				event: {
					name: data.name,
					times: times,
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
				<TitleSmall>CREATE A</TitleSmall>
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
						defaultOption="Select..."
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
							<StatNumber>{stats.personCount ?? '10+'}</StatNumber>
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
