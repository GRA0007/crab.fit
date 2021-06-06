import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

import {
	Button,
	Center,
	Footer,
  Logo,
} from 'components';

import {
	StyledMain,
	AboutSection,
	P,
} from '../Home/homeStyle';

const Privacy = () => {
  const { push } = useHistory();
  const { t } = useTranslation(['common', 'privacy']);

	useEffect(() => {
		document.title = `${t('privacy:name')} - Crab Fit`;
	}, [t]);

	return (
		<>
			<StyledMain>
        <Logo />
      </StyledMain>

      <StyledMain>
  			<h1>{t('privacy:name')}</h1>
  			<h3>Crab Fit</h3>
        <P>{t('privacy:p1')}</P>
        <P>{t('privacy:p2')}</P>
        <P>{t('privacy:p3')}</P>

        <h2>{t('privacy:h1')}</h2>
        <P>{t('privacy:p4')}</P>
        <P>{t('privacy:p5')}</P>
        <P>
          <ul>
            <li><a href="https://www.google.com/policies/privacy/" target="blank">{t('privacy:link')}</a></li>
          </ul>
        </P>

        <h2>{t('privacy:h2')}</h2>
        <P>{t('privacy:p6')}</P>

        <h2>{t('privacy:h3')}</h2>
        <P>{t('privacy:p7')}</P>
        <P>{t('privacy:p8')}</P>

        <h2>{t('privacy:h4')}</h2>
        <P>{t('privacy:p9')}</P>
        <P>
          <ul>
            <li>{t('privacy:l1')}</li>
            <li>{t('privacy:l2')}</li>
            <li>{t('privacy:l3')}</li>
            <li>{t('privacy:l4')}</li>
          </ul>
        </P>
        <P>{t('privacy:p10')}</P>

        <h2>{t('privacy:h5')}</h2>
        <P>{t('privacy:p11')}</P>

        <h2>{t('privacy:h6')}</h2>
        <P>{t('privacy:p12')}</P>

        <h2>{t('privacy:h7')}</h2>
        <P><Trans i18nKey="privacy:p13">The Service does not address anyone under the age of 13. Personally identifiable information is not knowingly collected from children under 13. If discovered that a child under 13 has provided the Service with personal information, such information will be immediately deleted from the servers. If you are a parent or guardian and you are aware that your child has provided the Service with personal information, please <a href="mailto:crabfit@bengrant.dev">contact us</a> so that this information can be removed.</Trans></P>

        <h2>{t('privacy:h8')}</h2>
        <P>{t('privacy:p14')}</P>
        <P>{t('privacy:p15')}</P>

        <h2>{t('privacy:h9')}</h2>
        <P><Trans i18nKey="privacy:p16">If you have any questions or suggestions about the Privacy Policy, do not hesitate to contact us at <a href="mailto:crabfit@bengrant.dev">crabfit@bengrant.dev</a>.</Trans></P>
      </StyledMain>

			<AboutSection id="about">
				<StyledMain>
					<Center><Button onClick={() => push('/')}>{t('common:cta')}</Button></Center>
				</StyledMain>
			</AboutSection>

			<Footer />
		</>
	);
};

export default Privacy;
