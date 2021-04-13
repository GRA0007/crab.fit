import { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import {
	BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { ThemeProvider, Global } from '@emotion/react';

import { Settings, Loading, Egg } from 'components';

import { useSettingsStore } from 'stores';
import theme from 'theme';

const EGG_PATTERN = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const Home = lazy(() => import('pages/Home/Home'));
const Event = lazy(() => import('pages/Event/Event'));

const App = () => {
  const colortheme = useSettingsStore(state => state.theme);
	const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const [isDark, setIsDark] = useState(darkQuery.matches);
  const [offline, setOffline] = useState(!window.navigator.onLine);

  const [eggCount, setEggCount] = useState(0);
  const [eggVisible, setEggVisible] = useState(false);
  const [eggKey, setEggKey] = useState(0);

  const eggHandler = useCallback(
    event => {
      if (EGG_PATTERN.indexOf(event.key) < 0 || event.key !== EGG_PATTERN[eggCount]) {
        setEggCount(0);
        return;
      }
      setEggCount(eggCount+1);
      if (EGG_PATTERN.length === eggCount+1) {
        setEggKey(eggKey+1);
        setEggCount(0);
        setEggVisible(true);
      }
    },
    [eggCount, eggKey]
  );

	darkQuery.addListener(e => colortheme === 'System' && setIsDark(e.matches));

  useEffect(() => {
    const onOffline = () => setOffline(true);
    const onOnline = () => setOffline(false);

    window.addEventListener('offline', onOffline, false);
    window.addEventListener('online', onOnline, false);

    return () => {
      window.removeEventListener('offline', onOffline, false);
      window.removeEventListener('online', onOnline, false);
    };
  }, []);

  useEffect(() => {
    document.addEventListener('keyup', eggHandler, false);

    return () => {
      document.removeEventListener('keyup', eggHandler, false);
    };
  }, [eggHandler]);

  useEffect(() => {
    setIsDark(colortheme === 'System' ? darkQuery.matches : colortheme === 'Dark');
  }, [colortheme, darkQuery.matches]);

  return (
		<BrowserRouter>
			<ThemeProvider theme={theme[isDark ? 'dark' : 'light']}>
				<Global
					styles={theme => ({
						html: {
							scrollBehavior: 'smooth',
						},
						body: {
							backgroundColor: theme.background,
							color: theme.text,
							fontFamily: `'Karla', sans-serif`,
							fontWeight: theme.mode === 'dark' ? 500 : 600,
							margin: 0,
						},
						a: {
							color: theme.primary,
						},
						'*::-webkit-scrollbar': {
							width: 16,
							height: 16,
						},
						'*::-webkit-scrollbar-track': {
							background: `${theme.primaryBackground}`,
						},
						'*::-webkit-scrollbar-thumb': {
							borderRadius: 100,
							border: `4px solid ${theme.primaryBackground}`,
							width: 12,
							background: `${theme.primaryLight}AA`,
						},
						'*::-webkit-scrollbar-thumb:hover': {
							background: `${theme.primaryLight}CC`,
						},
						'*::-webkit-scrollbar-thumb:active': {
							background: `${theme.primaryLight}`,
						},
					})}
				/>
		    <Switch>
					<Route path="/" exact render={props => (
            <Suspense fallback={<Loading />}>
              <Home offline={offline} {...props} />
            </Suspense>
          )} />
					<Route path="/:id" exact render={props => (
            <Suspense fallback={<Loading />}>
              <Event offline={offline} {...props} />
            </Suspense>
          )} />
				</Switch>

        <Settings />

        {eggVisible && <Egg eggKey={eggKey} onClose={() => setEggVisible(false)} />}
			</ThemeProvider>
		</BrowserRouter>
  );
}

export default App;
