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
  onSegmentFocus,
	...props
}) => {
	const theme = useTheme();

	return (
		<Wrapper>
			<Label>{min}/{total} available</Label>

			<Bar onMouseOut={() => onSegmentFocus(null)}>
				{[...Array(max+1-min).keys()].map(i => i+min).map(i =>
					<Grade
            key={i}
            color={`${theme.primary}${Math.round((i/(max))*255).toString(16)}`}
            onMouseOver={() => onSegmentFocus(i)}
          />
				)}
			</Bar>

			<Label>{max}/{total} available</Label>
		</Wrapper>
	);
};

export default Legend;
