import { Button } from 'components';

import { useTranslateStore } from 'stores';

import {
  Wrapper,
  ButtonWrapper,
} from './translateDialogStyle';

const TranslateDialog = ({ onClose }) => {
  const navigatorLang = useTranslateStore(state => state.navigatorLang);
  const setDialogDismissed = useTranslateStore(state => state.setDialogDismissed);

  return (
    <Wrapper>
      <div>
        <h2>Translate Crab Fit</h2>
        <p>Crab Fit hasn't been translated to your language yet.</p>
      </div>
      <ButtonWrapper>
        <Button
          target="_blank"
          rel="noreferrer noopener"
          href={`https://docs.google.com/forms/d/e/1FAIpQLSd5bcs8LTP_8Ydrh2e4iMlZft5x81qSfAxekuuQET27A2mBhA/viewform?usp=pp_url&entry.1530835706=__other_option__&entry.1530835706.other_option_response=${encodeURIComponent(navigatorLang)}`}
        >Help translate!</Button>
        <Button secondary onClick={() => setDialogDismissed(true)}>Close</Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default TranslateDialog;
