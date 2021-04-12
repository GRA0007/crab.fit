import { useState, useEffect, Suspense, lazy } from 'react';
import {
	BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { ThemeProvider, Global } from '@emotion/react';

import { Settings, Loading } from 'components';

import { useSettingsStore } from 'stores';
import theme from 'theme';

const Home = lazy(() => import('pages/Home/Home'));
const Event = lazy(() => import('pages/Event/Event'));

const App = () => {
  const colortheme = useSettingsStore(state => state.theme);
	const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const [isDark, setIsDark] = useState(darkQuery.matches);

	darkQuery.addListener(e => colortheme === 'System' && setIsDark(e.matches));

  useEffect(() => {
    setIsDark(colortheme === 'System' ? darkQuery.matches : colortheme === 'Dark');
  }, [colortheme, darkQuery.matches]);

  return (
		<BrowserRouter>
			<ThemeProvider theme={theme[isDark ? 'dark' : 'light']}>
				{process.env.NODE_ENV !== 'production' && <button onClick={() => setIsDark(!isDark)} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}>{isDark ? 'dark' : 'light'}</button>}
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
              <Home {...props} />
            </Suspense>
          )} />
					<Route path="/:id" exact render={props => (
            <Suspense fallback={<Loading />}>
              <Event {...props} />
            </Suspense>
          )} />
				</Switch>

        <Settings />
			</ThemeProvider>
		</BrowserRouter>
  );
}

export default App;
