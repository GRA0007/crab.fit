import { useState } from 'react';
import { useTheme } from '@emotion/react';
import { useTranslation } from 'react-i18next';

import { ToggleField, SelectField } from 'components';

import { useSettingsStore } from 'stores';

import {
  OpenButton,
  Modal,
  Heading,
  Cover,
} from './settingsStyle';

const Settings = () => {
  const theme = useTheme();
  const store = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation('common');

  return (
    <>
      <OpenButton
        isOpen={isOpen}
        tabIndex="1"
        type="button"
        onClick={() => setIsOpen(!isOpen)} title={t('options.name')}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </OpenButton>

      <Cover isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <Modal isOpen={isOpen}>
        <Heading>{t('options.name')}</Heading>

        <ToggleField
          label={t('options.weekStart.label')}
          name="weekStart"
          id="weekStart"
          options={{
            'Sunday': t('options.weekStart.options.Sunday'),
            'Monday': t('options.weekStart.options.Monday'),
          }}
          value={store.weekStart === 0 ? 'Sunday' : 'Monday'}
          onChange={value => store.setWeekStart(value === 'Sunday' ? 0 : 1)}
        />

        <ToggleField
          label={t('options.timeFormat.label')}
          name="timeFormat"
          id="timeFormat"
          options={{
            '12h': t('options.timeFormat.options.12h'),
            '24h': t('options.timeFormat.options.24h'),
          }}
          value={store.timeFormat}
          onChange={value => store.setTimeFormat(value)}
        />

        <ToggleField
          label={t('options.theme.label')}
          name="theme"
          id="theme"
          options={{
            'System': t('options.theme.options.System'),
            'Light': t('options.theme.options.Light'),
            'Dark': t('options.theme.options.Dark'),
          }}
          value={store.theme}
          onChange={value => store.setTheme(value)}
        />

        <ToggleField
          label={t('options.highlight.label')}
          name="highlight"
          id="highlight"
          title={t('options.highlight.title')}
          options={{
            'Off': t('options.highlight.options.Off'),
            'On': t('options.highlight.options.On'),
          }}
          value={store.highlight ? 'On' : 'Off'}
          onChange={value => store.setHighlight(value === 'On')}
        />

        <SelectField
          label={t('options.language.label')}
          name="language"
          id="language"
          options={{
            'en': 'English',
            'de': 'Deutsch',
            'es': 'Español',
            'ko': '한국어',
            ...process.env.NODE_ENV !== 'production' && { 'cimode': 'DEV' },
          }}
          small
          value={i18n.language}
          onChange={event => i18n.changeLanguage(event.target.value)}
        />
      </Modal>
    </>
  );
};

export default Settings;
