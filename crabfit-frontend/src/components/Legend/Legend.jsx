import { useTranslation } from 'react-i18next'

import { useSettingsStore } from '/src/stores'

import {
  Wrapper,
  Label,
  Bar,
  Grade,
} from './Legend.styles'

const Legend = ({
  min,
  max,
  total,
  onSegmentFocus,
}) => {
  const { t } = useTranslation('event')
  const highlight = useSettingsStore(state => state.highlight)
  const setHighlight = useSettingsStore(state => state.setHighlight)

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
            color={`#FF0000${Math.round((i/(max))*255).toString(16)}`}
            highlight={highlight && i === max && max > 0}
            onMouseOver={() => onSegmentFocus(i)}
          />
        )}
      </Bar>

      <Label>{max}/{total} {t('event:available')}</Label>
    </Wrapper>
  )
}

export default Legend
