import styled from '@emotion/styled';

export const StyledMain = styled.div`
	width: 600px;
	margin: 20px auto;
	max-width: calc(100% - 60px);
`;

export const CreateForm = styled.form`
`;

export const TitleSmall = styled.span`
	display: block;
	margin: 0;
	font-size: 3rem;
	text-align: center;
	font-family: 'Samurai Bob', sans-serif;
	font-weight: 400;
	color: ${props => props.theme.primaryDark};
	line-height: 1em;
`;

export const TitleLarge = styled.h1`
	margin: 0;
	font-size: 4rem;
	text-align: center;
	color: ${props => props.theme.primary};
	font-family: 'Molot', sans-serif;
	font-weight: 400;
	text-shadow: 0 4px 0 ${props => props.theme.primaryDark};
	line-height: 1em;

	@media (max-width: 350px) {
		font-size: 3.5rem;
	}
`;

export const Logo = styled.img`
	width: 80px;
`;

export const Links = styled.nav`
	text-align: center;
	margin: 20px 0;
`;

export const AboutSection = styled.section`
	margin: 60px 0 0;
	background-color: ${props => props.theme.primaryBackground};
	padding: 20px 0;
`;

export const Footer = styled.footer`
	width: 600px;
	margin: 20px auto;
	max-width: calc(100% - 60px);
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const P = styled.p`
	font-weight: 500;
	line-height: 1.6em;
`;

export const Stats = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: flex-start;
	flex-wrap: wrap;
`;

export const Stat = styled.div`
	text-align: center;
	padding: 0 6px;
	min-width: 160px;
	margin: 10px 0;
`;

export const StatNumber = styled.span`
	display: block;
	font-weight: 900;
	color: ${props => props.theme.primaryDark};
	font-size: 2em;
`;

export const StatLabel = styled.span`
	display: block;
`;

export const OfflineMessage = styled.div`
	text-align: center;
  margin: 50px 0 20px;
`;
