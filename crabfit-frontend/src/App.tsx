import { useState } from 'react';
import {
	BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { ThemeProvider, Global } from '@emotion/react';

import { Settings } from 'components';
import {
	Home,
	Event,
} from 'pages';

import theme from 'theme';

const App = () => {
	const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
	const [isDark, setIsDark] = useState(darkQuery.matches);

	darkQuery.addListener(e => setIsDark(e.matches));

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
					<Route path="/" component={Home} exact />
					<Route path="/:id" component={Event} exact />
				</Switch>

        <Settings />
			</ThemeProvider>
		</BrowserRouter>
  );
}

export default App;
