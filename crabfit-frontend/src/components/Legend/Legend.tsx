import { useTheme } from '@emotion/react';
import { useSettingsStore } from 'stores';

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
  const highlight = useSettingsStore(state => state.highlight);
  const setHighlight = useSettingsStore(state => state.setHighlight);

	return (
		<Wrapper>
			<Label>{min}/{total} available</Label>

			<Bar
        onMouseOut={() => onSegmentFocus(null)}
        onClick={() => setHighlight(!highlight)}
        title="Click to highlight highest availability"
      >
				{[...Array(max+1-min).keys()].map(i => i+min).map(i =>
					<Grade
            key={i}
            color={`${theme.primary}${Math.round((i/(max))*255).toString(16)}`}
            highlight={highlight && i === max}
            onMouseOver={() => onSegmentFocus(i)}
          />
				)}
			</Bar>

			<Label>{max}/{total} available</Label>
		</Wrapper>
	);
};

export default Legend;
