import { makeClass } from '/src/utils'

import styles from './Skeleton.module.scss'

interface SkeletonProps {
  isSpecificDates?: boolean
}

const Skeleton = ({ isSpecificDates }: SkeletonProps) => <div className={styles.skeleton}>
  {isSpecificDates ? <div className={makeClass(styles.dayLabels, styles.dateLabels)}>{Array.from({ length: 5 }).map((_, i) => <span key={i} />)}</div> : null}
  <div className={styles.dayLabels}>{Array.from({ length: 5 }).map((_, i) => <span key={i} />)}</div>
  <div />
</div>

export default Skeleton
