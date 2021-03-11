import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
	Center,
	Donate,
	TextField,
	SelectField,
	Button,
	Legend,
	AvailabilityViewer,
	AvailabilityEditor,
	Error,
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

import api from 'services';
import { useSettingsStore } from 'stores';

import logo from 'res/logo.svg';
import timezones from 'res/timezones.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const Event = (props) => {
  const timeFormat = useSettingsStore(state => state.timeFormat);
  const weekStart = useSettingsStore(state => state.weekStart);

	const { register, handleSubmit } = useForm();
	const { id } = props.match.params;
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

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const response = await api.get(`/event/${id}`);

				setEvent(response.data);
				document.title = `${response.data.name} | Crab Fit`;
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		};

		fetchEvent();
	}, [id]);

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
	}, [times, timeFormat]);

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
				setError('Password is incorrect. Check your name is spelled right.');
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
					setError('Failed to create user. Please try again.');
				}
			}
		} finally {
			setIsLoginLoading(false);
		}
	};

	return (
		<>
			<StyledMain>
				<Link to="/" style={{ textDecoration: 'none' }}>
					<Center>
						<Logo src={logo} alt="" />
						<Title>CRAB FIT</Title>
					</Center>
					<Center style={{ textDecoration: 'underline', fontSize: 14, paddingTop: 6 }}>Create your own</Center>
				</Link>

				{(!!event || isLoading) ? (
					<>
						<EventName isLoading={isLoading}>{event?.name}</EventName>
						<ShareInfo>https://crab.fit/{id}</ShareInfo>
						<ShareInfo isLoading={isLoading}>
							{!!event?.name &&
								<>Copy the link to this page, or share via <a href={`mailto:?subject=${encodeURIComponent(`Scheduling ${event?.name}`)}&body=${encodeURIComponent(`Visit this link to enter your availabilities: https://crab.fit/${id}`)}`}>email</a>.</>
							}
						</ShareInfo>
					</>
				) : (
					<div style={{ margin: '100px 0' }}>
						<EventName>Event not found</EventName>
						<ShareInfo>Check that the url you entered is correct.</ShareInfo>
					</div>
				)}
			</StyledMain>

			{(!!event || isLoading) && (
				<>
					<LoginSection id="login">
						<StyledMain>
							{user ? (
								<h2>Signed in as {user.name}</h2>
							) : (
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
											type="submit"
											isLoading={isLoginLoading}
											disabled={isLoginLoading || isLoading}
										>Login</Button>
									</LoginForm>
									{error && <Error onClose={() => setError(null)}>{error}</Error>}
									<Info>These details are only for this event. Use a password to prevent others from changing your availability.</Info>
								</>
							)}

							<SelectField
								label="Your time zone"
								name="timezone"
								id="timezone"
								inline
								value={timezone}
								onChange={event => setTimezone(event.currentTarget.value)}
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
								<Legend
									min={min}
									max={max}
									total={people.filter(p => p.availability.length > 0).length}
								/>
								<Center>Hover or tap the calendar below to see who is available</Center>
							</StyledMain>
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
							<StyledMain>
								<Center>Click and drag the calendar below to set your availabilities</Center>
							</StyledMain>
							<AvailabilityEditor
								times={times}
								timeLabels={timeLabels}
								dates={dates}
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

			<Footer id="donate">
				<span>Thank you for using Crab Fit. If you like it, consider donating.</span>
				<Donate />
			</Footer>
		</>
	);
};

export default Event;
