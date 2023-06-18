import EventAvailabilities from '/src/app/[id]/EventAvailabilities'
import Content from '/src/components/Content/Content'

import styles from './page.module.scss'

const Loading = async () => <>
  <Content>
    <h1 className={styles.name}><span className={styles.bone} /></h1>
    <div className={styles.date}><span className={styles.bone} /></div>
    <div className={styles.info}><span className={styles.bone} style={{ width: '20em' }} /></div>
    <div className={styles.info}><span className={styles.bone} style={{ width: '20em' }} /></div>
  </Content>

  <EventAvailabilities />
</>

export default Loading
