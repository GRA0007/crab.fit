import styled from '@emotion/styled';

export const Time = styled.div`
	height: 10px;
	margin: 1px;
	background-color: ${props => props.theme.background};
	touch-action: none;

	${props => props.time.slice(2, 4) !== '00' && `
		margin-top: -1px;
		border-top: 2px solid transparent;
	`}
	${props => props.time.slice(2, 4) === '30' && `
		margin-top: -1px;
		border-top: 2px dotted ${props.theme.text};
	`}

	${props => (props.selected || (props.mode === 'add' && props.selecting)) && `
		background-color: ${props.theme.primary};
	`};
	${props => props.mode === 'remove' && props.selecting && `
		background-color: ${props.theme.background};
	`};
`;
