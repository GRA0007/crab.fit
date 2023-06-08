import { createPalette } from 'hue-map'

import { useStore } from '/src/stores'
import useSettingsStore from '/src/stores/settingsStore'

export const usePalette = (min: number, max: number) => {
  const colormap = useStore(useSettingsStore, state => state.colormap)

  return createPalette({
    map: (colormap === undefined || colormap === 'crabfit') ? [[0, [247, 158, 0, 0]], [1, [247, 158, 0, 255]]] : colormap,
    steps: Math.max((max - min) + 1, 2),
  }).format()
}
