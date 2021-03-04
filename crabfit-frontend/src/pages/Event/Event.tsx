import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

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

import logo from 'res/logo.svg';
import timezones from 'res/timezones.json';

const Event = (props) => {
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

	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);

	const fetchPeople = useCallback(async () => {
		try {
			const response = await api.get(`/event/${id}/people`);
			setPeople(response.data.people);
		} catch (e) {
			console.error(e);
		}
	}, [id]);

	useEffect(() => {
		const fetchEvent = async () => {
			try {
				const response = await api.get(`/event/${id}`);
				let times = [];
				for (let i = response.data.startTime; i < response.data.endTime; i++) {
					let hour = `${i}`.padStart(2, '0');
					times.push(
						`${hour}00`,
						`${hour}15`,
						`${hour}30`,
						`${hour}45`,
					);
				}

				setEvent({
					...response.data,
					times,
				});
				setIsLoading(false);
			} catch (e) {
				console.error(e);
				//TODO: 404
			}
		};

		fetchEvent();
		fetchPeople();
	}, [fetchPeople, id]);

	useEffect(() => {
		if (tab === 'group') {
			fetchPeople();
		}
	}, [fetchPeople, tab]);

	useEffect(() => {
		if (event && !!people.length) {
			const datetimes = event.dates.reduce(
				(dates, date) => {
					let times = [];
					event.times.forEach(time => {
						times.push(`${time}-${date}`);
					});
					return [...dates, ...times];
				}
				, []
			);
			setMin(datetimes.reduce((min, time) => {
					let total = people.reduce(
						(total, person) => person.availability.includes(time) ? total+1 : total,
						0
					);
					return total < min ? total : min;
				},
				Infinity
			));
			setMax(datetimes.reduce((max, time) => {
					let total = people.reduce(
						(total, person) => person.availability.includes(time) ? total+1 : total,
						0
					);
					return total > max ? total : max;
				},
				-Infinity
			));
		}
	}, [event, people]);

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
			setUser(response.data);
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

				<EventName isLoading={isLoading}>{event?.name}</EventName>
				<ShareInfo isLoading={isLoading}>{!!event?.name && `https://crab.fit/${id}`}</ShareInfo>
				<ShareInfo isLoading={isLoading}>
					{!!event?.name &&
						<>Copy the link to this page, or share via <a href={`mailto:?subject=${encodeURIComponent(`Scheduling ${event?.name}`)}&body=${encodeURIComponent(`Visit this link to enter your availabilities: https://crab.fit/${id}`)}`}>Email</a>.</>
					}
				</ShareInfo>
			</StyledMain>

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
						<Legend
							min={min}
							max={max}
							total={people.filter(p => p.availability.length > 0).length}
						/>
						<Center>Hover or tap the calendar below to see who is available</Center>
					</StyledMain>
					<AvailabilityViewer
						dates={event?.dates ?? []}
						times={event?.times ?? []}
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
						dates={event?.dates ?? []}
						times={event?.times ?? []}
						value={user.availability}
						onChange={async availability => {
							const oldAvailability = [...user.availability];
							setUser({ ...user, availability });
							const response = await api.patch(`/event/${id}/people/${user.name}`, {
								person: {
									password,
									availability,
								},
							});
							if (response.status !== 200) {
								console.log(response);
								setUser({ ...user, oldAvailability });
							}
						}}
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
