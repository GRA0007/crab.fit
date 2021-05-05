import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
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
	Error,
  Footer,
} from 'components';

import {
	StyledMain,
	CreateForm,
	TitleSmall,
	TitleLarge,
	Logo,
	Links,
	AboutSection,
	P,
	Stats,
	Stat,
	StatNumber,
	StatLabel,
  OfflineMessage,
  Recent,
} from './homeStyle';

import api from 'services';
import { useRecentsStore } from 'stores';

import logo from 'res/logo.svg';
import timezones from 'res/timezones.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const Home = ({ offline }) => {
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
  const recentsStore = useRecentsStore();

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

			if (times.length === 0) {
				return setError(`You don't have any time selected`);
			}

			const response = await api.post('/event', {
				event: {
					name: data.name,
					times: times,
          timezone: data.timezone,
				},
			});
			push(`/${response.data.id}`);
      gtag('event', 'create_event', {
        'event_category': 'home',
      });
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
      </StyledMain>

      {!!recentsStore.recents.length && (
        <AboutSection id="recents">
          <StyledMain>
            <h2>Recently visited</h2>
            {recentsStore.recents.map(event => (
              <Recent href={`/${event.id}`} key={event.id}>
                <span className="name">{event.name}</span>
                <span className="date">Created {dayjs.unix(event.created).format('D MMMM, YYYY')}</span>
              </Recent>
            ))}
          </StyledMain>
        </AboutSection>
      )}

      <StyledMain>
        {offline ? (
          <OfflineMessage>
            <h1>🦀📵</h1>
            <P>You can't create a Crab Fit when you don't have an internet connection. Please make sure you're connected.</P>
          </OfflineMessage>
        ) : (
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
        )}
			</StyledMain>

			<AboutSection id="about">
				<StyledMain>
					<h2>About Crab Fit</h2>
					<Stats>
						<Stat>
							<StatNumber>{stats.eventCount ?? '100+'}</StatNumber>
							<StatLabel>Events created</StatLabel>
						</Stat>
						<Stat>
							<StatNumber>{stats.personCount ?? '100+'}</StatNumber>
							<StatLabel>Availabilities entered</StatLabel>
						</Stat>
					</Stats>
					<P>Crab Fit helps you fit your event around everyone's schedules. Simply create an event above and send the link to everyone that is participating. Results update live and you will be able to see a heat-map of when everyone is free.<br /><Link to="/how-to">Learn more about how to Crab Fit</Link>.</P>
					{/* eslint-disable-next-line */}
					<P>Create a lot of Crab Fits? Get the <a href="https://chrome.google.com/webstore/detail/crab-fit/pnafiibmjbiljofcpjlbonpgdofjhhkj" target="_blank">Chrome extension</a> or <a href="https://addons.mozilla.org/en-US/firefox/addon/crab-fit/" target="_blank">Firefox extension</a> for your browser! You can also download the <a href="https://play.google.com/store/apps/details?id=fit.crab" target="_blank">Android app</a> to Crab Fit on the go.</P>
          {/* eslint-disable-next-line */}
					<P>Created by <a href="https://bengrant.dev" target="_blank">Ben Grant</a>, Crab Fit is the modern-day solution to your group event planning debates.</P>
					<P>The code for Crab Fit is open source, if you find any issues or want to contribute, you can visit the <a href="https://github.com/GRA0007/crab.fit" target="_blank" rel="noreferrer">repository</a>. By using Crab Fit you agree to the <Link to="/privacy">privacy policy</Link>.</P>
          <P>Crab Fit costs more than <strong>$100 per month</strong> to run. Consider donating below if it helped you out so it can stay free for everyone. 🦀</P>
				</StyledMain>
			</AboutSection>

			<Footer />
		</>
	);
};

export default Home;
