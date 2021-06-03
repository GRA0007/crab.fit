import { useState, useEffect } from 'react';
import { PublicClientApplication } from "@azure/msal-browser";
import { Client } from "@microsoft/microsoft-graph-client";
import { useTranslation } from 'react-i18next';

import { Button, Center } from 'components';
import { Loader } from '../Loading/loadingStyle';
import {
  LoginButton,
  CalendarList,
  CheckboxInput,
  CheckboxLabel,
  CalendarLabel,
  Info,
  Options,
  Title,
  Icon,
} from '../GoogleCalendar/googleCalendarStyle';

import outlookLogo from 'res/outlook.svg';

const scopes = ['Calendars.Read', 'Calendars.Read.Shared'];

// Initialise the MSAL object
const publicClientApplication = new PublicClientApplication({
  auth: {
    clientId: '5d1ab8af-1ba3-4b79-b033-b0ee509c2be6',
    redirectUri: process.env.NODE_ENV === 'production' ? 'https://crab.fit' : 'http://localhost:3000',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: true,
  },
});

const getAuthenticatedClient = accessToken => {
  const client = Client.init({
    authProvider: done => done(null, accessToken),
  });
  return client;
};

const OutlookCalendar = ({ timeZone, timeMin, timeMax, onImport }) => {
  const [client, setClient] = useState(undefined);
  const [calendars, setCalendars] = useState(undefined);
  const [freeBusyLoading, setFreeBusyLoading] = useState(false);
  const { t } = useTranslation('event');

  const checkLogin = async () => {
    const accounts = publicClientApplication.getAllAccounts();
    if (accounts && accounts.length > 0) {
      try {
        const accessToken = await getAccessToken();
        setClient(getAuthenticatedClient(accessToken));
      } catch (e) {
        console.error(e);
        signOut();
      }
    } else {
      setClient(null);
    }
  };

  const signIn = async () => {
    try {
      await publicClientApplication.loginPopup({ scopes });
    } catch (e) {
      console.error(e);
    } finally {
      checkLogin();
    }
  };

  const signOut = async () => {
    try {
      await publicClientApplication.logoutRedirect({
        onRedirectNavigate: () => false,
      });
    } catch (e) {
      console.error(e);
    } finally {
      checkLogin();
    }
  };

  const getAccessToken = async () => {
    try {
      const accounts = publicClientApplication.getAllAccounts();
      if (accounts.length <= 0) throw new Error('login_required');

      // Try to get silently
      const result = await publicClientApplication.acquireTokenSilent({
        scopes,
        account: accounts[0],
      });
      return result.accessToken;
    } catch (e) {
      if ([
        'consent_required',
        'interaction_required',
        'login_required',
        'no_account_in_silent_request'
      ].includes(e.message)) {
        // Try to get with popup
        const result = await publicClientApplication.acquireTokenPopup({ scopes });
        return result.accessToken;
      } else {
        throw e;
      }
    }
  };

  const importAvailability = () => {
    setFreeBusyLoading(true);
    gtag('event', 'outlook_cal_sync', {
      'event_category': 'event',
    });
    client.api('/me/calendar/getSchedule').post({
      schedules: calendars.filter(c => c.checked).map(c => c.id),
      startTime: {
        dateTime: timeMin,
        timeZone,
      },
      endTime: {
        dateTime: timeMax,
        timeZone,
      },
      availabilityViewInterval: 30,
    })
      .then(response => {
        onImport(response.value.reduce((busy, c) => c.hasOwnProperty('error') ? busy : [...busy, ...c.scheduleItems.filter(item => item.status === 'busy' || item.status === 'tentative')], []));
      })
      .catch(e => {
        console.error(e);
        signOut();
      })
      .finally(() => setFreeBusyLoading(false));
  };

  useEffect(() => checkLogin(), []);

  useEffect(() => {
    if (client) {
      client.api('/me/calendars').get()
        .then(response => {
          setCalendars(response.value.map(item => ({
            'name': item.name,
            'description': item.owner.name,
            'id': item.owner.address,
            'color': item.hexColor,
            'checked': item.isDefaultCalendar === true,
          })));
        })
        .catch(e => {
          console.error(e);
          signOut();
        });
    }
  }, [client]);

	return (
    <>
      {!client ? (
        <Center>
    		  <Button
            onClick={() => signIn()}
            isLoading={client === undefined}
            buttonWidth={`${Math.max(t('event:you.outlook_cal').length*10, 270)}px`}
            primaryColor="#0364B9"
            secondaryColor="#02437D">
            <LoginButton>
              <img src={outlookLogo} alt="" />
              <span>{t('event:you.outlook_cal')}</span>
            </LoginButton>
          </Button>
        </Center>
      ) : (
        <CalendarList>
          <Title>
            <Icon src={outlookLogo} alt="" />
            {/* eslint-disable-next-line */}
            <strong>{t('event:you.outlook_cal')}</strong>
            (<a href="#" onClick={e => {
              e.preventDefault();
              signOut();
            }}>{t('event:you.google_cal.logout')}</a>)
          </Title>
          <Options>
            {calendars !== undefined && !calendars.every(c => c.checked) && (
              /* eslint-disable-next-line */
              <a href="#" onClick={e => {
                e.preventDefault();
                setCalendars(calendars.map(c => ({...c, checked: true})));
              }}>{t('event:you.google_cal.select_all')}</a>
            )}
            {calendars !== undefined && calendars.every(c => c.checked) && (
              /* eslint-disable-next-line */
              <a href="#" onClick={e => {
                e.preventDefault();
                setCalendars(calendars.map(c => ({...c, checked: false})));
              }}>{t('event:you.google_cal.select_none')}</a>
            )}
          </Options>
          {calendars !== undefined ? calendars.map(calendar => (
            <div key={calendar.id}>
              <CheckboxInput
                type="checkbox"
                role="checkbox"
                id={calendar.id}
                color={calendar.color}
                checked={calendar.checked}
                onChange={e => setCalendars(calendars.map(c => c.id === calendar.id ? {...c, checked: !c.checked} : c))}
              />
              <CheckboxLabel htmlFor={calendar.id} color={calendar.color} />
              <CalendarLabel htmlFor={calendar.id}>{calendar.name}</CalendarLabel>
            </div>
          )) : (
            <Loader />
          )}
          {calendars !== undefined && (
            <>
              <Info>{t('event:you.google_cal.info')}</Info>
              <Button
                buttonWidth="170px"
                buttonHeight="35px"
                isLoading={freeBusyLoading}
                disabled={freeBusyLoading}
                onClick={() => importAvailability()}
              >{t('event:you.google_cal.button')}</Button>
            </>
          )}
        </CalendarList>
      )}
    </>
	);
};

export default OutlookCalendar;
