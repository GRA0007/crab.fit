import { useTranslation } from 'react-i18next';
import { useRecentsStore } from 'stores';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { AboutSection, StyledMain } from '../../pages/Home/homeStyle';
import { Recent } from './recentsStyle';

dayjs.extend(relativeTime);

const Recents = () => {
  const recents = useRecentsStore(state => state.recents);
  const { t } = useTranslation(['home', 'common']);

  return !!recents.length && (
    <AboutSection id="recents">
      <StyledMain>
        <h2>{t('home:recently_visited')}</h2>
        {recents.map(event => (
          <Recent href={`/${event.id}`} key={event.id}>
            <span className="name">{event.name}</span>
            <span className="date" title={dayjs.unix(event.created).format('D MMMM, YYYY')}>{t('common:created')} {dayjs.unix(event.created).fromNow()}</span>
          </Recent>
        ))}
      </StyledMain>
    </AboutSection>
  );
};

export default Recents;
