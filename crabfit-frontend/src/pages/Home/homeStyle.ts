import styled from '@emotion/styled';

export const StyledMain = styled.main`
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
	font-family: 'CF Samurai Bob';
	font-weight: 400;
	color: ${props => props.theme.primaryDark};
	line-height: 1em;
`;

export const TitleLarge = styled.h1`
	margin: 0 0 40px;
	font-size: 4rem;
	text-align: center;
	color: ${props => props.theme.primary};
	font-family: 'Molot';
	font-weight: 400;
	text-shadow: 0 4px 0 ${props => props.theme.primaryDark};
	line-height: 1em;
`;

export const Logo = styled.img`
	width: 80px;
`;
