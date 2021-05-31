import styled from '@emotion/styled';

export const EventName = styled.h1`
	text-align: center;
	font-weight: 800;
	margin: 20px 0 5px;

	${props => props.isLoading && `
		&:after {
			content: '';
			display: inline-block;
			height: 1em;
			width: 400px;
			max-width: 100%;
			background-color: ${props.theme.loading};
			border-radius: 3px;
		}
	`}
`;

export const EventDate = styled.span`
  display: block;
  text-align: center;
  font-size: 14px;
  opacity: .8;
  margin: 0 0 10px;
  font-weight: 500;
  letter-spacing: .01em;

  ${props => props.isLoading && `
		&:after {
			content: '';
			display: inline-block;
			height: 1em;
			width: 200px;
			max-width: 100%;
			background-color: ${props.theme.loading};
			border-radius: 3px;
		}
	`}
`;

export const LoginForm = styled.form`
	display: grid;
	grid-template-columns: 1fr 1fr auto;
	align-items: flex-end;
	grid-gap: 18px;

	@media (max-width: 500px) {
		grid-template-columns: 1fr 1fr;
	}
	@media (max-width: 400px) {
		grid-template-columns: 1fr;

    & div:last-child {
      --btn-width: 100%;
    }
	}
`;

export const LoginSection = styled.section`
	background-color: ${props => props.theme.primaryBackground};
	padding: 10px 0;
`;

export const Info = styled.p`
	margin: 18px 0;
	opacity: .6;
	font-size: 12px;
`;

export const ShareInfo = styled.p`
	margin: 6px 0;
	text-align: center;
	font-size: 15px;

	${props => props.isLoading && `
		&:after {
			content: '';
			display: inline-block;
			height: 1em;
			width: 300px;
			max-width: 100%;
			background-color: ${props.theme.loading};
			border-radius: 3px;
		}
	`}

  ${props => props.onClick && `
    cursor: pointer;

    &:hover {
      color: ${props.theme.primaryDark};
    }
  `}
`;

export const Tabs = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 30px 0 20px;
`;

export const Tab = styled.a`
	user-select: none;
	text-decoration: none;
	display: block;
	color: ${props => props.theme.text};
	padding: 8px 18px;
	background-color: ${props => props.theme.primaryBackground};
	border: 1px solid ${props => props.theme.primaryLight};
	border-bottom: 0;
	margin: 0 4px;
	border-top-left-radius: 5px;
	border-top-right-radius: 5px;

	${props => props.selected && `
		color: #FFF;
		background-color: ${props.theme.primary};
		border-color: ${props.theme.primary};
	`}

	${props => props.disabled && `
		opacity: .5;
		cursor: not-allowed;
	`}
`;
