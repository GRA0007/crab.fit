import { useTranslation } from 'react-i18next'

import { Donate } from '/src/components'
import { Wrapper } from './Footer.styles'

const Footer = props => {
  const { t } = useTranslation('common')

  return (
    <Wrapper id="donate" {...props}>
      <span>{t('donate.info')}</span>
      <Donate />
    </Wrapper>
  )
}

export default Footer
