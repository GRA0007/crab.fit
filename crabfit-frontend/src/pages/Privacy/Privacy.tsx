import { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import {
	Button,
	Center,
	Donate,
} from 'components';

import {
	StyledMain,
	Logo,
  Title,
	AboutSection,
	Footer,
	P,
} from '../Help/helpStyle';

import logo from 'res/logo.svg';

const Privacy = () => {
  const { push } = useHistory();

	useEffect(() => {
		document.title = 'Privacy Policy - Crab Fit';
	}, []);

	return (
		<>
			<StyledMain>
        <Link to="/" style={{ textDecoration: 'none' }}>
					<Center>
						<Logo src={logo} alt="" />
						<Title>CRAB FIT</Title>
					</Center>
					<Center style={{ textDecoration: 'underline', fontSize: 14, paddingTop: 6 }}>Create your own</Center>
				</Link>
      </StyledMain>

      <StyledMain>
  			<h1>Privacy Policy</h1>
  			<h3>Crab Fit</h3>
        <P>This SERVICE is provided by Benjamin Grant at no cost and is intended for use as is.</P>
        <P>This page is used to inform visitors regarding the policies of the collection, use, and disclosure of Personal Information if using the Service.</P>
        <P>If you choose to use the Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that is collected is used for providing and improving the Service. Your information will not be used or shared with anyone except as described in this Privacy Policy.</P>

        <h2>Information Collection and Use</h2>
        <P>The Service uses third party services that may collect information used to identify you.</P>
        <P>Links to privacy policies of the third party service providers used by the Service:</P>
        <P>
          <ul>
            <li><a href="https://www.google.com/policies/privacy/" target="blank">Google Play Services</a></li>
          </ul>
        </P>

        <h2>Log Data</h2>
        <P>When you use the Service, in the case of an error, data and information is collected to improve the Service, which may include your IP address, device name, operating system version, app configuration and the time and date of the error.</P>

        <h2>Cookies</h2>
        <P>Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.</P>
        <P>Cookies are used by Google Analytics to track you across the web and provide anonymous statistics to improve the Service.</P>

        <h2>Service Providers</h2>
        <P>Third-party companies may be employed for the following reasons:</P>
        <P>
          <ul>
            <li>To facilitate the Service</li>
            <li>To provide the Service on our behalf</li>
            <li>To perform Service-related services</li>
            <li>To assist in analyzing how the Service is used</li>
          </ul>
        </P>
        <P>To perform these tasks, the third parties may have access to your Personal Information, but are obligated not to disclose or use this information for any purpose except the above.</P>

        <h2>Security</h2>
        <P>Personal Information that is shared via the Service is protected, however remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, so take care when sharing Personal Information.</P>

        <h2>Links to Other Sites</h2>
        <P>The Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by the Service. Therefore, you are advised to review the Privacy Policy of these websites.</P>

        <h2>Children's Privacy</h2>
        <P>The Service does not address anyone under the age of 13. Personally identifiable information is not knowingly collected from children under 13. If discovered that a child under 13 has provided the Service with personal information, such information will be immediately deleted from the servers. If you are a parent or guardian and you are aware that your child has provided the Service with personal information, please <a href="mailto:benjamin.grantGRA0007+crabfit@gmail.com">contact us</a> so that this information can be removed.</P>

        <h2>Changes to This Privacy Policy</h2>
        <P>This Privacy Policy may be updated from time to time. Thus, you are advised to review this page periodically for any changes.</P>
        <P>This policy is effective as of 2021-04-20</P>

        <h2>Contact Us</h2>
        <P>If you have any questions or suggestions about the Privacy Policy, do not hesitate to contact us at <a href="mailto:benjamin.grantGRA0007+crabfit@gmail.com">benjamin.grantGRA0007+crabfit@gmail.com</a>.</P>
      </StyledMain>

			<AboutSection id="about">
				<StyledMain>
					<Center><Button buttonWidth="230px" onClick={() => push('/')}>Create your own Crab Fit!</Button></Center>
				</StyledMain>
			</AboutSection>

			<Footer id="donate">
				<span>Thank you for using Crab Fit. If you like it, consider donating.</span>
				<Donate />
			</Footer>
		</>
	);
};

export default Privacy;
