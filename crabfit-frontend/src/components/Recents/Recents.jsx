import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import { useRecentsStore, useLocaleUpdateStore } from '/src/stores'

import { AboutSection, StyledMain } from '../../pages/Home/Home.styles'
import { Wrapper, Recent } from './Recents.styles'

dayjs.extend(relativeTime)

const Recents = ({ target }) => {
  const recents = useRecentsStore(state => state.recents)
  const locale = useLocaleUpdateStore(state => state.locale)
  const { t } = useTranslation(['home', 'common'])

  return !!recents.length && (
    <Wrapper>
      <AboutSection id="recents">
        <StyledMain>
          <h2>{t('home:recently_visited')}</h2>
          {recents.map(event => (
            <Recent href={`/${event.id}`} target={target} key={event.id}>
              <span className="name">{event.name}</span>
              <span locale={locale} className="date" title={dayjs.unix(event.created).format('D MMMM, YYYY')}>{t('common:created', { date: dayjs.unix(event.created).fromNow() })}</span>
            </Recent>
          ))}
        </StyledMain>
      </AboutSection>
    </Wrapper>
  )
}

export default Recents
