import { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';

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
  Recents,
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
} from './homeStyle';

import api from 'services';

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
  const { t } = useTranslation(['common', 'home']);

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
				return setError(t('home:form.errors.no_dates'));
			}
      const isSpecificDates = typeof dates[0] === 'string' && dates[0].length === 8;
			if (start === end) {
				return setError(t('home:form.errors.same_times'));
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
				return setError(t('home:form.errors.no_time'));
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
			setError(t('home:form.errors.unknown'));
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
				<TitleSmall altChars={/[A-Z]/g.test(t('home:create'))}>{t('home:create')}</TitleSmall>
				<TitleLarge>CRAB FIT</TitleLarge>
				<Links>
					<a href="#about">{t('home:nav.about')}</a> / <a href="#donate">{t('home:nav.donate')}</a>
				</Links>
      </StyledMain>

      <Recents />

      <StyledMain>
        {offline ? (
          <OfflineMessage>
            <h1>🦀📵</h1>
            <P>{t('home:offline')}</P>
          </OfflineMessage>
        ) : (
  				<CreateForm onSubmit={handleSubmit(onSubmit)} id="create">
  					<TextField
  						label={t('home:form.name.label')}
  						subLabel={t('home:form.name.sublabel')}
  						type="text"
  						name="name"
  						id="name"
  						register={register}
  					/>

  					<CalendarField
  						label={t('home:form.dates.label')}
  						subLabel={t('home:form.dates.sublabel')}
  						name="dates"
  						id="dates"
  						required
  						register={register}
  					/>

  					<TimeRangeField
  						label={t('home:form.times.label')}
  						subLabel={t('home:form.times.sublabel')}
  						name="times"
  						id="times"
  						required
  						register={register}
  					/>

  					<SelectField
  						label={t('home:form.timezone.label')}
  						name="timezone"
  						id="timezone"
  						register={register}
  						options={timezones}
  						required
  						defaultOption={t('home:form.timezone.defaultOption')}
  					/>

  					{error && (
  						<Error onClose={() => setError(null)}>{error}</Error>
  					)}

  					<Center>
  						<Button type="submit" isLoading={isLoading} disabled={isLoading}>{t('home:form.button')}</Button>
  					</Center>
  				</CreateForm>
        )}
			</StyledMain>

			<AboutSection id="about">
				<StyledMain>
					<h2>{t('home:about.name')}</h2>
					<Stats>
						<Stat>
							<StatNumber>{stats.eventCount ?? '300+'}</StatNumber>
							<StatLabel>{t('home:about.events')}</StatLabel>
						</Stat>
						<Stat>
							<StatNumber>{stats.personCount ?? '400+'}</StatNumber>
							<StatLabel>{t('home:about.availabilities')}</StatLabel>
						</Stat>
					</Stats>
					<P><Trans i18nKey="home:about.content.p1">Crab Fit helps you fit your event around everyone's schedules. Simply create an event above and send the link to everyone that is participating. Results update live and you will be able to see a heat-map of when everyone is free.<br /><Link to="/how-to">Learn more about how to Crab Fit</Link>.</Trans></P>
					{/* eslint-disable-next-line */}
					<P><Trans i18nKey="home:about.content.p2">Create a lot of Crab Fits? Get the <a href="https://chrome.google.com/webstore/detail/crab-fit/pnafiibmjbiljofcpjlbonpgdofjhhkj" target="_blank">Chrome extension</a> or <a href="https://addons.mozilla.org/en-US/firefox/addon/crab-fit/" target="_blank">Firefox extension</a> for your browser! You can also download the <a href="https://play.google.com/store/apps/details?id=fit.crab" target="_blank">Android app</a> to Crab Fit on the go.</Trans></P>
          {/* eslint-disable-next-line */}
					<P><Trans i18nKey="home:about.content.p3">Created by <a href="https://bengrant.dev" target="_blank">Ben Grant</a>, Crab Fit is the modern-day solution to your group event planning debates.</Trans></P>
					<P><Trans i18nKey="home:about.content.p4">The code for Crab Fit is open source, if you find any issues or want to contribute, you can visit the <a href="https://github.com/GRA0007/crab.fit" target="_blank" rel="noreferrer">repository</a>. By using Crab Fit you agree to the <Link to="/privacy">privacy policy</Link>.</Trans></P>
          <P><Trans i18nKey="home:about.content.p5">Consider donating below if it helped you out so it can stay free for everyone. 🦀</Trans></P>
				</StyledMain>
			</AboutSection>

			<Footer />
		</>
	);
};

export default Home;
