import { useForm } from 'react-hook-form';

import {
	TextField,
	CalendarField,
	TimeRangeField,
	Button,
} from 'components';

import {
	StyledMain,
	CreateForm,
	TitleSmall,
	TitleLarge,
} from './homeStyle';

const Home = () => {
	const { register, handleSubmit } = useForm();

	const onSubmit = data => console.log('submit', data);

	return (
		<StyledMain>
			<TitleSmall>Create a</TitleSmall>
			<TitleLarge>CRAB FIT</TitleLarge>

			<CreateForm onSubmit={handleSubmit(onSubmit)}>
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
					register={register}
				/>

				<TimeRangeField
					label="What times might work?"
					subLabel="Click and drag to select a time range"
					name="times"
					id="times"
					register={register}
				/>

				<Button type="submit">Create</Button>
			</CreateForm>
		</StyledMain>
	);
};

export default Home;
