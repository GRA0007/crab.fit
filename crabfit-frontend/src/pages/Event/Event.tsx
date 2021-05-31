import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import {
	Footer,
	TextField,
	SelectField,
	Button,
	AvailabilityViewer,
	AvailabilityEditor,
	Error,
  Logo,
} from 'components';

import { StyledMain } from '../Home/homeStyle';

import {
	EventName,
  EventDate,
	LoginForm,
	LoginSection,
	Info,
	ShareInfo,
	Tabs,
	Tab,
} from './eventStyle';

import api from 'services';
import { useSettingsStore, useRecentsStore, useLocaleUpdateStore } from 'stores';

import timezones from 'res/timezones.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const Event = (props) => {
  const timeFormat = useSettingsStore(state => state.timeFormat);
  const weekStart = useSettingsStore(state => state.weekStart);

  const addRecent = useRecentsStore(state => state.addRecent);
  const locale = useLocaleUpdateStore(state => state.locale);

  const { t } = useTranslation(['common', 'event']);

	const { register, handleSubmit } = useForm();
	const { id } = props.match.params;
  const { offline } = props;
	const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
	const [user, setUser] = useState(null);
	const [password, setPassword] = useState(null);
	const [tab, setTab] = useState(user ? 'you' : 'group');
	const [isLoading, setIsLoading] = useState(true);
	const [isLoginLoading, setIsLoginLoading] = useState(false);
	const [error, setError] = useState(null);
	const [event, setEvent] = useState(null);
	const [people, setPeople] = useState([]);

	const [times, setTimes] = useState([]);
	const [timeLabels, setTimeLabels] = useState([]);
	const [dates, setDates] = useState([]);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);

	const [copied, setCopied] = useState(null);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const response = await api.get(`/event/${id}`);

				setEvent(response.data);
        addRecent({
          id: response.data.id,
          created: response.data.created,
          name: response.data.name,
        });
				document.title = `${response.data.name} | Crab Fit`;
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvent();
	}, [id, addRecent]);

	useEffect(() => {
		const fetchPeople = async () => {
			try {
				const response = await api.get(`/event/${id}/people`);
				const adjustedPeople = response.data.people.map(person => ({
					...person,
					availability: (!!person.availability.length && person.availability[0].length === 13)
            ? person.availability.map(date => dayjs(date, 'HHmm-DDMMYYYY').utc(true).tz(timezone).format('HHmm-DDMMYYYY'))
            : person.availability.map(date => dayjs(date, 'HHmm').day(date.substring(5)).utc(true).tz(timezone).format('HHmm-d')),
				}));
				setPeople(adjustedPeople);
			} catch (e) {
				console.error(e);
			}
		}

		if (tab === 'group') {
			fetchPeople();
		}
	}, [tab, id, timezone]);

	// Convert to timezone and expand minute segments
	useEffect(() => {
		if (event) {
      const isSpecificDates = event.times[0].length === 13;
			setTimes(event.times.reduce(
				(allTimes, time) => {
          const date = isSpecificDates ?
            dayjs(time, 'HHmm-DDMMYYYY').utc(true).tz(timezone)
            : dayjs(time, 'HHmm').day(time.substring(5)).utc(true).tz(timezone);
          const format = isSpecificDates ? 'HHmm-DDMMYYYY' : 'HHmm-d';
					return [
						...allTimes,
						date.minute(0).format(format),
						date.minute(15).format(format),
						date.minute(30).format(format),
						date.minute(45).format(format),
					];
				},
				[]
			).sort((a, b) => {
        if (isSpecificDates) {
          return dayjs(a, 'HHmm-DDMMYYYY').diff(dayjs(b, 'HHmm-DDMMYYYY'));
        } else {
          return dayjs(a, 'HHmm').day((parseInt(a.substring(5))-weekStart % 7 + 7) % 7)
            .diff(dayjs(b, 'HHmm').day((parseInt(b.substring(5))-weekStart % 7 + 7) % 7));
        }
      }));
		}
	}, [event, timezone, weekStart]);

	useEffect(() => {
		if (!!times.length && !!people.length) {
			setMin(times.reduce((min, time) => {
					let total = people.reduce(
						(total, person) => person.availability.includes(time) ? total+1 : total,
						0
					);
					return total < min ? total : min;
				},
				Infinity
			));
			setMax(times.reduce((max, time) => {
					let total = people.reduce(
						(total, person) => person.availability.includes(time) ? total+1 : total,
						0
					);
					return total > max ? total : max;
				},
				-Infinity
			));
		}
	}, [times, people]);

	useEffect(() => {
		if (!!times.length) {
			setTimeLabels(times.reduce((labels, datetime) => {
				const time = datetime.substring(0, 4);
				if (labels.includes(time)) return labels;
				return [...labels, time];
			}, [])
			.sort((a, b) => parseInt(a) - parseInt(b))
			.reduce((labels, time, i, allTimes) => {
				if (time.substring(2) === '30') return [...labels, { label: '', time }];
				if (allTimes.length - 1 === i) return [
					...labels,
					{ label: '', time },
					{ label: dayjs(time, 'HHmm').add(1, 'hour').format(timeFormat === '12h' ? 'h A' : 'HH'), time: null }
				];
				if (allTimes.length - 1 > i && parseInt(allTimes[i+1].substring(0, 2))-1 > parseInt(time.substring(0, 2))) return [
					...labels,
					{ label: '', time },
					{ label: dayjs(time, 'HHmm').add(1, 'hour').format(timeFormat === '12h' ? 'h A' : 'HH'), time: 'space' },
					{ label: '', time: 'space' },
					{ label: '', time: 'space' },
				];
				if (time.substring(2) !== '00') return [...labels, { label: '', time }];
				return [...labels, { label: dayjs(time, 'HHmm').format(timeFormat === '12h' ? 'h A' : 'HH'), time }];
			}, []));

			setDates(times.reduce((allDates, time) => {
				if (time.substring(2, 4) !== '00') return allDates;
				const date = time.substring(5);
				if (allDates.includes(date)) return allDates;
				return [...allDates, date];
			}, []));
		}
	}, [times, timeFormat, locale]);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.post(`/event/${id}/people/${user.name}`, { person: { password } });
				const adjustedUser = {
					...response.data,
					availability: (!!response.data.availability.length && response.data.availability[0].length === 13)
            ? response.data.availability.map(date => dayjs(date, 'HHmm-DDMMYYYY').utc(true).tz(timezone).format('HHmm-DDMMYYYY'))
            : response.data.availability.map(date => dayjs(date, 'HHmm').day(date.substring(5)).utc(true).tz(timezone).format('HHmm-d')),
				};
				setUser(adjustedUser);
			} catch (e) {
				console.log(e);
			}
		};

		if (user) {
			fetchUser();
		}
	// eslint-disable-next-line
	}, [timezone]);

	const onSubmit = async data => {
		setIsLoginLoading(true);
		setError(null);
		try {
			const response = await api.post(`/event/${id}/people/${data.name}`, {
				person: {
					password: data.password,
				},
			});
			setPassword(data.password);
			const adjustedUser = {
				...response.data,
				availability: (!!response.data.availability.length && response.data.availability[0].length === 13)
          ? response.data.availability.map(date => dayjs(date, 'HHmm-DDMMYYYY').utc(true).tz(timezone).format('HHmm-DDMMYYYY'))
          : response.data.availability.map(date => dayjs(date, 'HHmm').day(date.substring(5)).utc(true).tz(timezone).format('HHmm-d')),
			};
			setUser(adjustedUser);
			setTab('you');
		} catch (e) {
			if (e.status === 401) {
				setError(t('event:form.errors.password_incorrect'));
			} else if (e.status === 404) {
				// Create user
				try {
					await api.post(`/event/${id}/people`, {
						person: {
							name: data.name,
							password: data.password,
						},
					});
					setPassword(data.password);
					setUser({
						name: data.name,
						availability: [],
					});
					setTab('you');
				} catch (e) {
					setError(t('event:form.errors.unknown'));
				}
			}
		} finally {
			setIsLoginLoading(false);
      gtag('event', 'login', {
        'event_category': 'event',
      });
		}
	};

	return (
		<>
			<StyledMain>
				<Logo />

				{(!!event || isLoading) ? (
					<>
						<EventName isLoading={isLoading}>{event?.name}</EventName>
            <EventDate isLoading={isLoading} locale={locale} title={event?.created && dayjs.unix(event?.created).format('D MMMM, YYYY')}>{event?.created && t('common:created', { date: dayjs.unix(event?.created).fromNow() })}</EventDate>
						<ShareInfo
              onClick={() => navigator.clipboard?.writeText(`https://crab.fit/${id}`)
                  .then(() => {
                    setCopied(t('event:nav.copied'));
                    setTimeout(() => setCopied(null), 1000);
                    gtag('event', 'copy_link', {
                      'event_category': 'event',
                    });
                  })
                  .catch((e) => console.error('Failed to copy', e))
              }
              title={!!navigator.clipboard ? t('event:nav.title') : ''}
            >{copied ?? `https://crab.fit/${id}`}</ShareInfo>
						<ShareInfo isLoading={isLoading}>
							{!!event?.name &&
								<Trans i18nKey="event:nav.shareinfo">Copy the link to this page, or share via <a onClick={() => gtag('event', 'send_email', { 'event_category': 'event' })} href={`mailto:?subject=${encodeURIComponent(t('event:nav.email_subject', { event_name: event?.name }))}&body=${encodeURIComponent(`${t('event:nav.email_body')} https://crab.fit/${id}`)}`}>email</a>.</Trans>
							}
						</ShareInfo>
					</>
				) : (
          offline ? (
            <div style={{ margin: '100px 0' }}>
  						<EventName>{t('event:offline.title')}</EventName>
  						<ShareInfo><Trans i18nKey="event:offline.body" /></ShareInfo>
  					</div>
          ) : (
  					<div style={{ margin: '100px 0' }}>
  						<EventName>{t('event:error.title')}</EventName>
  						<ShareInfo>{t('event:error.body')}</ShareInfo>
  					</div>
          )
				)}
			</StyledMain>

			{(!!event || isLoading) && (
				<>
					<LoginSection id="login">
						<StyledMain>
							{user ? (
								<h2>{t('event:form.signed_in', { name: user.name })}</h2>
							) : (
								<>
									<h2>{t('event:form.signed_out')}</h2>
									<LoginForm onSubmit={handleSubmit(onSubmit)}>
										<TextField
											label={t('event:form.name')}
											type="text"
											name="name"
											id="name"
											inline
											required
											register={register}
										/>

										<TextField
											label={t('event:form.password')}
											type="password"
											name="password"
											id="password"
											inline
											register={register}
										/>

										<Button
											type="submit"
											isLoading={isLoginLoading}
											disabled={isLoginLoading || isLoading}
                      buttonWidth={`${Math.max(t('event:form.button').length*11, 100)}px`}
										>{t('event:form.button')}</Button>
									</LoginForm>
									{error && <Error onClose={() => setError(null)}>{error}</Error>}
									<Info>{t('event:form.info')}</Info>
								</>
							)}

							<SelectField
								label={t('event:form.timezone')}
								name="timezone"
								id="timezone"
								inline
								value={timezone}
								onChange={event => setTimezone(event.currentTarget.value)}
								options={timezones}
							/>
              {/* eslint-disable-next-line */}
              {event?.timezone && event.timezone !== timezone && <p><Trans i18nKey="event:form.created_in_timezone">This event was created in the timezone <strong>{{timezone: event.timezone}}</strong>. <a href="#" onClick={e => {
                e.preventDefault();
                setTimezone(event.timezone);
              }}>Click here</a> to use it.</Trans></p>}
              {((
                Intl.DateTimeFormat().resolvedOptions().timeZone !== timezone
                && (event?.timezone && event.timezone !== Intl.DateTimeFormat().resolvedOptions().timeZone)
              ) || (
                event?.timezone === undefined
                && Intl.DateTimeFormat().resolvedOptions().timeZone !== timezone
              )) && (
                /* eslint-disable-next-line */
                <p><Trans i18nKey="event:form.local_timezone">Your local timezone is detected to be <strong>{{timezone: Intl.DateTimeFormat().resolvedOptions().timeZone}}</strong>. <a href="#" onClick={e => {
                  e.preventDefault();
                  setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
                }}>Click here</a> to use it.</Trans></p>
              )}
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
								title={user ? '' : t('event:tabs.you_tooltip')}
							>{t('event:tabs.you')}</Tab>
							<Tab
								href="#group"
								onClick={e => {
									e.preventDefault();
									setTab('group');
								}}
								selected={tab === 'group'}
							>{t('event:tabs.group')}</Tab>
						</Tabs>
					</StyledMain>

					{tab === 'group' ? (
						<section id="group">
							<AvailabilityViewer
								times={times}
								timeLabels={timeLabels}
								dates={dates}
                isSpecificDates={!!dates.length && dates[0].length === 8}
								people={people.filter(p => p.availability.length > 0)}
								min={min}
								max={max}
							/>
						</section>
					) : (
						<section id="you">
							<AvailabilityEditor
								times={times}
								timeLabels={timeLabels}
								dates={dates}
								timezone={timezone}
                isSpecificDates={!!dates.length && dates[0].length === 8}
								value={user.availability}
								onChange={async availability => {
									const oldAvailability = [...user.availability];
									const utcAvailability = (!!availability.length && availability[0].length === 13)
                    ? availability.map(date => dayjs.tz(date, 'HHmm-DDMMYYYY', timezone).utc().format('HHmm-DDMMYYYY'))
                    : availability.map(date => dayjs.tz(date, 'HHmm', timezone).day(date.substring(5)).utc().format('HHmm-d'));
									setUser({ ...user, availability });
									try {
										await api.patch(`/event/${id}/people/${user.name}`, {
											person: {
												password,
												availability: utcAvailability,
											},
										});
									} catch (e) {
										console.log(e);
										setUser({ ...user, oldAvailability });
									}
								}}
							/>
						</section>
					)}
				</>
			)}

			<Footer />
		</>
	);
};

export default Event;
