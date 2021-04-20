import styled from '@emotion/styled';

export const StyledMain = styled.div`
	width: 600px;
	margin: 10px auto;
	max-width: calc(100% - 30px);
`;

export const CreateForm = styled.form`
  margin: 0 0 30px;
`;

export const TitleSmall = styled.span`
	display: block;
	margin: 0;
	font-size: 2rem;
	text-align: center;
	font-family: 'Samurai Bob', sans-serif;
	font-weight: 400;
	color: ${props => props.theme.primaryDark};
	line-height: 1em;
`;

export const TitleLarge = styled.h1`
	margin: 0;
	font-size: 2rem;
	text-align: center;
	color: ${props => props.theme.primary};
	font-family: 'Molot', sans-serif;
	font-weight: 400;
	text-shadow: 0 3px 0 ${props => props.theme.primaryDark};
	line-height: 1em;
`;

export const P = styled.p`
	font-weight: 500;
	line-height: 1.6em;
`;

export const Footer = styled.footer`
	margin: 60px auto 0;
  width: 250px;

  & span {
    display: block;
    margin-bottom: 20px;
  }
`;

export const OfflineMessage = styled.div`
	text-align: center;
  margin: 50px 0 20px;
`;

export const ShareInfo = styled.p`
	margin: 6px 0;
	text-align: center;
	font-size: 15px;
  padding: 10px 0;

  ${props => props.onClick && `
    cursor: pointer;

    &:hover {
      color: ${props.theme.primaryDark};
    }
  `}
`;

export const AboutSection = styled.section`
	margin: 30px 0 0;
	background-color: ${props => props.theme.primaryBackground};
	padding: 10px 0;

  & h2 {
    margin: 0 0 10px;
    font-size: 1.2rem;
  }
`;
