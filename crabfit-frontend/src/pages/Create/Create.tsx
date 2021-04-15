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
	Donate,
	Error,
} from 'components';

import {
	StyledMain,
	CreateForm,
	TitleSmall,
	TitleLarge,
  P,
  OfflineMessage,
  ShareInfo,
  Footer,
  AboutSection,
  Recent,
} from './createStyle';

import api from 'services';
import { useRecentsStore } from 'stores';

import timezones from 'res/timezones.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const Create = ({ offline }) => {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		},
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [createdEvent, setCreatedEvent] = useState(null);
  const [copied, setCopied] = useState(null);

  const { push } = useHistory();

  const recentsStore = useRecentsStore();

	useEffect(() => {
    if (window.self === window.top) {
      push('/');
    }
		document.title = 'Create a Crab Fit';
	}, [push]);

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
				},
			});
      setCreatedEvent(response.data);
      recentsStore.addRecent({
        id: response.data.id,
        created: response.data.created,
        name: response.data.name,
      });
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
				<TitleSmall>CREATE A</TitleSmall>
				<TitleLarge>CRAB FIT</TitleLarge>
      </StyledMain>

      {createdEvent ? (
        <StyledMain>
          <OfflineMessage>
            <h2>Created {createdEvent.name}</h2>
            <ShareInfo
              onClick={() => navigator.clipboard?.writeText(`https://crab.fit/${createdEvent.id}`)
                  .then(() => {
                    setCopied('Copied!');
                    setTimeout(() => setCopied(null), 1000);
                    gtag('event', 'copy_link', {
                      'event_category': 'event',
                    });
                  })
                  .catch((e) => console.error('Failed to copy', e))
              }
              title={!!navigator.clipboard ? 'Click to copy' : ''}
            >{copied ?? `https://crab.fit/${createdEvent.id}`}</ShareInfo>
						<ShareInfo>
              {/* eslint-disable-next-line */}
							Click the link above to copy it to your clipboard, or share via <a onClick={() => gtag('event', 'send_email', { 'event_category': 'event' })} href={`mailto:?subject=${encodeURIComponent(`Scheduling ${createdEvent.name}`)}&body=${encodeURIComponent(`Visit this link to enter your availabilities: https://crab.fit/${createdEvent.id}`)}`} target="_blank">email</a>.
						</ShareInfo>
            <Footer>
              <span>Thank you for using Crab Fit. If you like it, consider donating.</span>
				      <Donate />
            </Footer>
          </OfflineMessage>
        </StyledMain>
      ) : (
        <>
          {!!recentsStore.recents.length && (
            <AboutSection id="recents">
              <StyledMain>
                <h2>Recently visited</h2>
                {recentsStore.recents.map(event => (
                  <Recent href={`/${event.id}`} target="_blank" key={event.id}>
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

      					<Button type="submit" isLoading={isLoading} disabled={isLoading} buttonWidth="100%">Create</Button>
      				</CreateForm>
            )}
    			</StyledMain>
        </>
      )}
		</>
	);
};

export default Create;
