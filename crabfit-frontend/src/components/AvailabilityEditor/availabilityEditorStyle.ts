import styled from '@emotion/styled';

export const Time = styled.div`
	height: 10px;
	border-left: 1px solid ${props => props.theme.primaryDark};
	touch-action: none;

	${props => props.time.slice(-2) === '00' && `
		border-top: 1px solid ${props.theme.primaryDark};
	`}
	${props => props.time.slice(-2) === '30' && `
		border-top: 1px dotted ${props.theme.primaryDark};
	`}

	${props => (props.selected || (props.mode === 'add' && props.selecting)) && `
		background-color: ${props.theme.primary};
	`};
	${props => props.mode === 'remove' && props.selecting && `
		background-color: initial;
	`};
`;
