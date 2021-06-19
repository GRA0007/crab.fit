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
  ButtonArea,
} from './homeStyle';

import api from 'services';
import { detect_browser } from 'utils';
import { useTWAStore } from 'stores';

import logo from 'res/logo.svg';
import timezones from 'res/timezones.json';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const Home = ({ offline }) => {
  const { register, handleSubmit, setValue } = useForm({
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
  const [browser, setBrowser] = useState(undefined);
  const { push } = useHistory();
  const { t } = useTranslation(['common', 'home']);
  const isTWA = useTWAStore(state => state.TWA);

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
    setBrowser(detect_browser());
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
              id="name"
              {...register('name')}
            />

            <CalendarField
              label={t('home:form.dates.label')}
              subLabel={t('home:form.dates.sublabel')}
              id="dates"
              required
              setValue={setValue}
              {...register('dates')}
            />

            <TimeRangeField
              label={t('home:form.times.label')}
              subLabel={t('home:form.times.sublabel')}
              id="times"
              required
              setValue={setValue}
              {...register('times')}
            />

            <SelectField
              label={t('home:form.timezone.label')}
              id="timezone"
              options={timezones}
              required
              {...register('timezone')}
              defaultOption={t('home:form.timezone.defaultOption')}
            />

            <Error open={!!error} onClose={() => setError(null)}>{error}</Error>

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
              <StatNumber>{stats.eventCount ?? '350+'}</StatNumber>
              <StatLabel>{t('home:about.events')}</StatLabel>
            </Stat>
            <Stat>
              <StatNumber>{stats.personCount ?? '550+'}</StatNumber>
              <StatLabel>{t('home:about.availabilities')}</StatLabel>
            </Stat>
          </Stats>
          <P><Trans i18nKey="home:about.content.p1">Crab Fit helps you fit your event around everyone's schedules. Simply create an event above and send the link to everyone that is participating. Results update live and you will be able to see a heat-map of when everyone is free.<br /><Link to="/how-to" rel="help">Learn more about how to Crab Fit</Link>.</Trans></P>
          {isTWA !== true && (
            <ButtonArea>
              {['chrome', 'firefox', 'safari'].includes(browser) && (
                <Button
                  href={{
                    chrome: 'https://chrome.google.com/webstore/detail/crab-fit/pnafiibmjbiljofcpjlbonpgdofjhhkj',
                    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/crab-fit/',
                    safari: 'https://apps.apple.com/us/app/crab-fit/id1570803259',
                  }[browser]}
                  icon={{
                    chrome: <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="currentColor" d="M12,20L15.46,14H15.45C15.79,13.4 16,12.73 16,12C16,10.8 15.46,9.73 14.62,9H19.41C19.79,9.93 20,10.94 20,12A8,8 0 0,1 12,20M4,12C4,10.54 4.39,9.18 5.07,8L8.54,14H8.55C9.24,15.19 10.5,16 12,16C12.45,16 12.88,15.91 13.29,15.77L10.89,19.91C7,19.37 4,16.04 4,12M15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12M12,4C14.96,4 17.54,5.61 18.92,8H12C10.06,8 8.45,9.38 8.08,11.21L5.7,7.08C7.16,5.21 9.44,4 12,4M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>,
                    firefox: <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="currentColor" d="M9.27 7.94C9.27 7.94 9.27 7.94 9.27 7.94M6.85 6.74C6.86 6.74 6.86 6.74 6.85 6.74M21.28 8.6C20.85 7.55 19.96 6.42 19.27 6.06C19.83 7.17 20.16 8.28 20.29 9.1L20.29 9.12C19.16 6.3 17.24 5.16 15.67 2.68C15.59 2.56 15.5 2.43 15.43 2.3C15.39 2.23 15.36 2.16 15.32 2.09C15.26 1.96 15.2 1.83 15.17 1.69C15.17 1.68 15.16 1.67 15.15 1.67H15.13L15.12 1.67L15.12 1.67L15.12 1.67C12.9 2.97 11.97 5.26 11.74 6.71C11.05 6.75 10.37 6.92 9.75 7.22C9.63 7.27 9.58 7.41 9.62 7.53C9.67 7.67 9.83 7.74 9.96 7.68C10.5 7.42 11.1 7.27 11.7 7.23L11.75 7.23C11.83 7.22 11.92 7.22 12 7.22C12.5 7.21 12.97 7.28 13.44 7.42L13.5 7.44C13.6 7.46 13.67 7.5 13.75 7.5C13.8 7.54 13.86 7.56 13.91 7.58L14.05 7.64C14.12 7.67 14.19 7.7 14.25 7.73C14.28 7.75 14.31 7.76 14.34 7.78C14.41 7.82 14.5 7.85 14.54 7.89C14.58 7.91 14.62 7.94 14.66 7.96C15.39 8.41 16 9.03 16.41 9.77C15.88 9.4 14.92 9.03 14 9.19C17.6 11 16.63 17.19 11.64 16.95C11.2 16.94 10.76 16.85 10.34 16.7C10.24 16.67 10.14 16.63 10.05 16.58C10 16.56 9.93 16.53 9.88 16.5C8.65 15.87 7.64 14.68 7.5 13.23C7.5 13.23 8 11.5 10.83 11.5C11.14 11.5 12 10.64 12.03 10.4C12.03 10.31 10.29 9.62 9.61 8.95C9.24 8.59 9.07 8.42 8.92 8.29C8.84 8.22 8.75 8.16 8.66 8.1C8.43 7.3 8.42 6.45 8.63 5.65C7.6 6.12 6.8 6.86 6.22 7.5H6.22C5.82 7 5.85 5.35 5.87 5C5.86 5 5.57 5.16 5.54 5.18C5.19 5.43 4.86 5.71 4.56 6C4.21 6.37 3.9 6.74 3.62 7.14C3 8.05 2.5 9.09 2.28 10.18C2.28 10.19 2.18 10.59 2.11 11.1L2.08 11.33C2.06 11.5 2.04 11.65 2 11.91L2 11.94L2 12.27L2 12.32C2 17.85 6.5 22.33 12 22.33C16.97 22.33 21.08 18.74 21.88 14C21.9 13.89 21.91 13.76 21.93 13.63C22.13 11.91 21.91 10.11 21.28 8.6Z" /></svg>,
                    safari: <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12C4,14.09 4.8,16 6.11,17.41L9.88,9.88L17.41,6.11C16,4.8 14.09,4 12,4M12,20A8,8 0 0,0 20,12C20,9.91 19.2,8 17.89,6.59L14.12,14.12L6.59,17.89C8,19.2 9.91,20 12,20M12,12L11.23,11.23L9.7,14.3L12.77,12.77L12,12M12,17.5H13V19H12V17.5M15.88,15.89L16.59,15.18L17.65,16.24L16.94,16.95L15.88,15.89M17.5,12V11H19V12H17.5M12,6.5H11V5H12V6.5M8.12,8.11L7.41,8.82L6.35,7.76L7.06,7.05L8.12,8.11M6.5,12V13H5V12H6.5Z" /></svg>,
                  }[browser]}
                  onClick={() => gtag('event', `download_extension_${browser}`, { 'event_category': 'home'})}
                  target="_blank"
                  rel="noreferrer noopener"
                  secondary
                >{{
                  chrome: t('home:about.chrome_extension'),
                  firefox: t('home:about.firefox_extension'),
                  safari: t('home:about.safari_extension'),
                }[browser]}</Button>
              )}
              <Button
                href="https://play.google.com/store/apps/details?id=fit.crab"
                icon={<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24"><path fill="currentColor" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" /></svg>}
                onClick={() => gtag('event', 'download_android_app', { 'event_category': 'home' })}
                target="_blank"
                rel="noreferrer noopener"
                secondary
              >{t('home:about.android_app')}</Button>
            </ButtonArea>
          )}
          <P><Trans i18nKey="home:about.content.p3">Created by <a href="https://bengrant.dev" target="_blank" rel="noreferrer noopener author">Ben Grant</a>, Crab Fit is the modern-day solution to your group event planning debates.</Trans></P>
          <P><Trans i18nKey="home:about.content.p4">The code for Crab Fit is open source, if you find any issues or want to contribute, you can visit the <a href="https://github.com/GRA0007/crab.fit" target="_blank" rel="noreferrer noopener">repository</a>. By using Crab Fit you agree to the <Link to="/privacy" rel="license">privacy policy</Link>.</Trans></P>
          <P>{t('home:about.content.p6')}</P>
          <P>{t('home:about.content.p5')}</P>
        </StyledMain>
      </AboutSection>

      <Footer />
    </>
  );
};

export default Home;
