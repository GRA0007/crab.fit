import { useTheme } from '@emotion/react';

import {
	Wrapper,
	Label,
	Bar,
	Grade,
} from './legendStyle';

const Legend = ({
	min,
	max,
	total,
	...props
}) => {
	const theme = useTheme();

	return (
		<Wrapper>
			<Label>{min}/{total} available</Label>

			<Bar>
				{[...Array(max-min+1).keys()].map(i =>
					<Grade key={i} color={`${theme.primary}${Math.round((i/(max-min))*255).toString(16)}`} />
				)}
			</Bar>

			<Label>{max}/{total} available</Label>
		</Wrapper>
	);
};

export default Legend;
