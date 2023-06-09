import { Metadata } from 'next'

import GoogleTranslate from '/src/app/privacy/GoogleTranslate'
import Button from '/src/components/Button/Button'
import Content from '/src/components/Content/Content'
import Footer from '/src/components/Footer/Footer'
import Header from '/src/components/Header/Header'
import { P, Ul } from '/src/components/Paragraph/Text'
import Section from '/src/components/Section/Section'
import { useTranslation } from '/src/i18n/server'

import styles from './page.module.scss'

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await useTranslation('privacy')

  return {
    title: t('name'),
  }
}

const Page = async () => {
  const { t, i18n } = await useTranslation(['common', 'privacy'])

  return <>
    <Content>
      <Header />

      <h1>{t('privacy:name')}</h1>

      {!i18n.language.startsWith('en') && <GoogleTranslate language={i18n.language}>{t('privacy:translate')}</GoogleTranslate>}

      <h3>Crab Fit</h3>
      <div id="policy">
        <P>This SERVICE is provided by Benjamin Grant at no cost and is intended for use as is.</P>
        <P>This page is used to inform visitors regarding the policies of the collection, use, and disclosure of Personal Information if using the Service.</P>
        <P>If you choose to use the Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that is collected is used for providing and improving the Service. Your information will not be used or shared with anyone except as described in this Privacy Policy.</P>

        <h2>Information Collection and Use</h2>
        <P>The Service uses third party services that may collect information used to identify you.</P>
        <P>Links to privacy policies of the third party service providers used by the Service:</P>
        <Ul>
          <li><a href="https://www.google.com/policies/privacy/" target="blank">Google Play Services</a> (only used for Google Calendar sync)</li>
          <li><a href="https://vercel.com/docs/concepts/analytics/privacy-policy" target="blank">Vercel Analytics</a></li>
        </Ul>

        <h2>Log Data</h2>
        <P>When you use the Service, in the case of an error, data and information is collected to improve the Service, which may include your IP address, device name, operating system version, app configuration and the time and date of the error.</P>

        <h2>Cookies</h2>
        <P>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</P>
        <P>Cookies are used by Google Analytics to track you across the web and provide anonymous statistics to improve the Service.</P>

        <h2>Service Providers</h2>
        <P>Third-party companies may be employed for the following reasons:</P>
        <Ul>
          <li>To facilitate the Service</li>
          <li>To provide the Service on our behalf</li>
          <li>To perform Service-related services</li>
          <li>To assist in analyzing how the Service is used</li>
        </Ul>
        <P>To perform these tasks, the third parties may have access to your Personal Information, but are obligated not to disclose or use this information for any purpose except the above.</P>

        <h2>Security</h2>
        <P>Personal Information that is shared via the Service is protected, however remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, so take care when sharing Personal Information.</P>
        <p className={styles.note}>Events that are created will be automatically permanently erased from storage after <strong>3 months</strong> of inactivity.</p>

        <h2>Links to Other Sites</h2>
        <P>The Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by the Service. Therefore, you are advised to review the Privacy Policy of these websites.</P>

        <h2>Children's Privacy</h2>
        <P>The Service does not address anyone under the age of 13. Personally identifiable information is not knowingly collected from children under 13. If discovered that a child under 13 has provided the Service with personal information, such information will be immediately deleted from the servers. If you are a parent or guardian and you are aware that your child has provided the Service with personal information, please contact us using the details below so that this information can be removed.</P>

        <h2>Changes to This Privacy Policy</h2>
        <P>This Privacy Policy may be updated from time to time. Thus, you are advised to review this page periodically for any changes.</P>
        <P>Last updated: 2023-06-10</P>

        <h2>Contact Us</h2>
        <P>If you have any questions or suggestions about the Privacy Policy, do not hesitate to contact us at <a href="mailto:contact@crab.fit">contact@crab.fit</a>.</P>
      </div>
    </Content>

    <Section>
      <Content isCentered>
        <Button href="/">{t('common:cta')}</Button>
      </Content>
    </Section>

    <Footer />
  </>
}

export default Page
