import { calculateTable, CalculateTableArgs } from '/src/utils'

self.onmessage = (e: MessageEvent<CalculateTableArgs>) => {
  self.postMessage(calculateTable(e.data))
}
