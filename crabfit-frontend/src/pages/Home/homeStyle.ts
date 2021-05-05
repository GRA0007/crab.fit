import styled from '@emotion/styled';

export const StyledMain = styled.div`
	width: 600px;
	margin: 20px auto;
	max-width: calc(100% - 60px);
`;

export const CreateForm = styled.form`
  margin: 0 0 60px;
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
	margin: 30px 0 0;
	background-color: ${props => props.theme.primaryBackground};
	padding: 20px 0;
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

export const Recent = styled.a`
	text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  flex-wrap: wrap;

  & .name {
    font-weight: 700;
    font-size: 1.1em;
    color: ${props => props.theme.primaryDark};
    flex: 1;
    display: block;
  }
  & .date {
    font-weight: 400;
    opacity: .8;
    white-space: nowrap;
  }

  &:hover .name {
    text-decoration: underline;
  }

  @media (max-width: 500px) {
    display: block;

    & .date {
      white-space: normal;
    }
  }
`;
