import { Link } from 'react-router-dom';

const Event = (props) => {
	const id = props.match.params.id;

	return (
		<div>
			<div>Event {id}</div>
			<Link to="/">Back home</Link>
		</div>
	);
};

export default Event;
