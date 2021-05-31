import { useTheme } from '@emotion/react';
import { useSettingsStore } from 'stores';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('event');
  const highlight = useSettingsStore(state => state.highlight);
  const setHighlight = useSettingsStore(state => state.setHighlight);

	return (
		<Wrapper>
			<Label>{min}/{total} {t('event:available')}</Label>

			<Bar
        onMouseOut={() => onSegmentFocus(null)}
        onClick={() => setHighlight(!highlight)}
        title={t('event:group.legend_tooltip')}
      >
				{[...Array(max+1-min).keys()].map(i => i+min).map(i =>
					<Grade
            key={i}
            color={`${theme.primary}${Math.round((i/(max))*255).toString(16)}`}
            highlight={highlight && i === max && max > 0}
            onMouseOver={() => onSegmentFocus(i)}
          />
				)}
			</Bar>

			<Label>{max}/{total} {t('event:available')}</Label>
		</Wrapper>
	);
};

export default Legend;
