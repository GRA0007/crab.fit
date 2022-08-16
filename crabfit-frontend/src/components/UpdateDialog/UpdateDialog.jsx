import { useTranslation } from 'react-i18next'

import { Button } from '/src/components'

import {
  Wrapper,
  ButtonWrapper,
} from './UpdateDialog.styles'

const UpdateDialog = ({ onClose }) => {
  const { t } = useTranslation('common')

  return (
    <Wrapper>
      <h2>{t('common:update.heading')}</h2>
      <p>{t('common:update.body')}</p>
      <ButtonWrapper>
        <Button secondary onClick={onClose}>{t('common:update.buttons.close')}</Button>
        <Button onClick={() => window.location.reload()}>{t('common:update.buttons.reload')}</Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

export default UpdateDialog
