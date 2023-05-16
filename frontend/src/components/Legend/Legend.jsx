import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPalette } from 'hue-map'

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
  const colormap = useSettingsStore(state => state.colormap)
  const setHighlight = useSettingsStore(state => state.setHighlight)

  const [palette, setPalette] = useState([])

  useEffect(() => setPalette(createPalette({
    map: colormap === 'crabfit' ? [[0, [247,158,0,0]], [1, [247,158,0,255]]] : colormap,
    steps: max+1-min,
  }).format()), [min, max, colormap])

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
            $color={palette[i]}
            $highlight={highlight && i === max && max > 0}
            onMouseOver={() => onSegmentFocus(i)}
          />
        )}
      </Bar>

      <Label>{max}/{total} {t('event:available')}</Label>
    </Wrapper>
  )
}

export default Legend
