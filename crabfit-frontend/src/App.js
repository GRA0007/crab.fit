import {
	BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';

import {
	Home,
	Event,
} from 'pages';

const App = () => {
  return (
		<BrowserRouter>
	    <Switch>
				<Route path="/" component={Home} exact />
				<Route path="/:id" component={Event} exact />
			</Switch>
		</BrowserRouter>
  );
}

export default App;
