import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
	Error,
  Recents,
  Footer,
} from 'components';

import {
	StyledMain,
	CreateForm,
	TitleSmall,
	TitleLarge,
  P,
  OfflineMessage,
  ShareInfo,
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
  const { t } = useTranslation(['common', 'home', 'event']);

  const addRecent = useRecentsStore(state => state.addRecent);

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
      setCreatedEvent(response.data);
      addRecent({
        id: response.data.id,
        created: response.data.created,
        name: response.data.name,
      });
      gtag('event', 'create_event', {
        'event_category': 'create',
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
				<TitleSmall>{t('home:create')}</TitleSmall>
				<TitleLarge>CRAB FIT</TitleLarge>
      </StyledMain>

      {createdEvent ? (
        <StyledMain>
          <OfflineMessage>
            <h2>{t('common:created', { date: createdEvent?.name })}</h2>
            <ShareInfo
              onClick={() => navigator.clipboard?.writeText(`https://crab.fit/${createdEvent.id}`)
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
            >{copied ?? `https://crab.fit/${createdEvent?.id}`}</ShareInfo>
						<ShareInfo>
              {/* eslint-disable-next-line */}
							<Trans i18nKey="event:nav.shareinfo_alt">Click the link above to copy it to your clipboard, or share via <a onClick={() => gtag('event', 'send_email', { 'event_category': 'event' })} href={`mailto:?subject=${encodeURIComponent(t('event:nav.email_subject', { event_name: createdEvent?.name }))}&body=${encodeURIComponent(`${t('event:nav.email_body')} https://crab.fit/${createdEvent?.id}`)}`} target="_blank">email</a>.</Trans>
						</ShareInfo>
            <Footer small />
          </OfflineMessage>
        </StyledMain>
      ) : (
        <>
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

      					<Button type="submit" isLoading={isLoading} disabled={isLoading} buttonWidth="100%">{t('home:form.button')}</Button>
      				</CreateForm>
            )}
    			</StyledMain>
        </>
      )}
		</>
	);
};

export default Create;
