import { useForm } from 'react-hook-form';

import {
	TextField,
	CalendarField,
	TimeRangeField,
	SelectField,
	Button,
	Center,
} from 'components';

import {
	StyledMain,
	CreateForm,
	TitleSmall,
	TitleLarge,
	Logo,
} from './homeStyle';

import logo from 'res/logo.svg';
import timezones from 'res/timezones.json';

const Home = () => {
	const { register, handleSubmit } = useForm({
		defaultValues: {
			timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		},
	});

	const onSubmit = data => console.log('submit', data);

	return (
		<StyledMain>
			<Center>
				<Logo src={logo} alt="" />
			</Center>
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

				<SelectField
					label="And the timezone"
					name="timezone"
					id="timezone"
					register={register}
					options={timezones}
					required
				/>

				<Center>
					<Button type="submit">Create</Button>
				</Center>
			</CreateForm>
		</StyledMain>
	);
};

export default Home;
