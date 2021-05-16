import { useState, useEffect } from 'react';
import { loadGapiInsideDOM } from 'gapi-script';

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
} from './googleCalendarStyle';

import googleLogo from 'res/google.svg';

const signIn = () => window.gapi.auth2.getAuthInstance().signIn();

const signOut = () => window.gapi.auth2.getAuthInstance().signOut();

const GoogleCalendar = ({ timeZone, timeMin, timeMax, onImport }) => {
  const [signedIn, setSignedIn] = useState(undefined);
  const [calendars, setCalendars] = useState(undefined);
  const [freeBusyLoading, setFreeBusyLoading] = useState(false);

  const calendarLogin = async () => {
    const gapi = await loadGapiInsideDOM();
    gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: '276505195333-9kjl7e48m272dljbspkobctqrpet0n8m.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
      })
        .then(() => {
          // Listen for state changes
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(isSignedIn => setSignedIn(isSignedIn));

          // Handle initial sign-in state
          setSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        })
        .catch(e => {
          console.error(e);
          setSignedIn(false);
        });
    });
  };

  const importAvailability = () => {
    setFreeBusyLoading(true);
    window.gapi.client.calendar.freebusy.query({
      timeMin,
      timeMax,
      timeZone,
      items: calendars.filter(c => c.checked).map(c => ({id: c.id})),
    })
      .then(response => {
        onImport(response.result.calendars ? Object.values(response.result.calendars).reduce((busy, c) => [...busy, ...c.busy], []) : []);
        setFreeBusyLoading(false);
      }, e => {
        console.error(e);
        setFreeBusyLoading(false);
      });
  };

  useEffect(() => calendarLogin(), []);

  useEffect(() => {
    if (signedIn) {
      window.gapi.client.calendar.calendarList.list({
        'minAccessRole': 'freeBusyReader'
      })
        .then(response => {
          setCalendars(response.result.items.map(item => ({
            'name': item.summary,
            'description': item.description,
            'id': item.id,
            'color': item.backgroundColor,
            'checked': item.hasOwnProperty('primary') && item.primary === true,
          })));
        })
        .catch(e => {
          console.error(e);
          signOut();
        });
    }
  }, [signedIn]);

	return (
    <>
      {!signedIn ? (
        <Center>
    		  <Button
            onClick={() => signIn()}
            isLoading={signedIn === undefined}
            buttonWidth="270px"
            primaryColor="#4286F5"
            secondaryColor="#3367BD">
            <LoginButton>
              <img src={googleLogo} alt="" />
              <span>Sync with Google Calendar</span>
            </LoginButton>
          </Button>
        </Center>
      ) : (
        <CalendarList>
          <p>
            {/* eslint-disable-next-line */}
            <strong>Sync with Google Calendar</strong> (<a href="#" onClick={e => {
              e.preventDefault();
              signOut();
            }}>log out</a>)
          </p>
          <Options>
            {calendars !== undefined && !calendars.every(c => c.checked) && (
              /* eslint-disable-next-line */
              <a href="#" onClick={e => {
                e.preventDefault();
                setCalendars(calendars.map(c => ({...c, checked: true})));
              }}>Select all</a>
            )}
            {calendars !== undefined && calendars.every(c => c.checked) && (
              /* eslint-disable-next-line */
              <a href="#" onClick={e => {
                e.preventDefault();
                setCalendars(calendars.map(c => ({...c, checked: false})));
              }}>Select none</a>
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
              <Info>Importing will overwrite your currently inputted availability</Info>
              <Button
                buttonWidth="170px"
                buttonHeight="35px"
                isLoading={freeBusyLoading}
                onClick={() => importAvailability()}
              >Import availability</Button>
            </>
          )}
        </CalendarList>
      )}
    </>
	);
};

export default GoogleCalendar;
