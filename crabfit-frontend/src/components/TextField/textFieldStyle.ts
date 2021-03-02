import styled from '@emotion/styled';

export const Wrapper = styled.div`
	margin: 30px 0;

	${props => props.inline && `
		margin: 0;
	`}
`;

export const StyledLabel = styled.label`
	display: block;
	padding-bottom: 4px;
	font-size: 18px;

	${props => props.inline && `
		font-size: 16px;
	`}
`;

export const StyledSubLabel = styled.label`
	display: block;
	padding-bottom: 6px;
	font-size: 13px;
	opacity: .6;
`;

export const StyledInput = styled.input`
	width: 100%;
	box-sizing: border-box;
	font: inherit;
	background: ${props => props.theme.primaryBackground};
	color: inherit;
	padding: 10px 14px;
	border: 1px solid ${props => props.theme.primaryLight};
	box-shadow: inset 0 0 0 0 ${props => props.theme.primaryLight};
	border-radius: 3px;
	font-size: 18px;
	outline: none;
	transition: border-color .15s, box-shadow .15s;

	&:focus {
		border: 1px solid ${props => props.theme.primary};
		box-shadow: inset 0 -3px 0 0 ${props => props.theme.primary};
	}
`;
