import { useState } from 'react';
import { useTheme } from '@emotion/react';

import { ToggleField } from 'components';

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

  return (
    <>
      <OpenButton
        isOpen={isOpen}
        tabIndex="1"
        type="button"
        onClick={() => setIsOpen(!isOpen)} title="Options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
      </OpenButton>

      <Cover isOpen={isOpen} onClick={() => setIsOpen(false)} />
      <Modal isOpen={isOpen}>
        <Heading>Options</Heading>

        <ToggleField
          label="Week starts on"
          name="weekStart"
          id="weekStart"
          options={['Sunday', 'Monday']}
          value={store.weekStart === 1 ? 'Monday' : 'Sunday'}
          onChange={value => store.setWeekStart(value === 'Monday' ? 1 : 0)}
        />

        <ToggleField
          label="Time format"
          name="timeFormat"
          id="timeFormat"
          options={['12h', '24h']}
          value={store.timeFormat}
          onChange={value => store.setTimeFormat(value)}
        />
      </Modal>
    </>
  );
};

export default Settings;
