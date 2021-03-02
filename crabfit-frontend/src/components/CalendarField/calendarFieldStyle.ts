import styled from '@emotion/styled';

export const Wrapper = styled.div`
	margin: 30px 0;
`;

export const StyledLabel = styled.label`
	display: block;
	padding-bottom: 4px;
	font-size: 18px;
`;

export const StyledSubLabel = styled.label`
	display: block;
	padding-bottom: 6px;
	font-size: 13px;
	opacity: .6;
`;

export const CalendarHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	user-select: none;
	padding: 6px 0;
	font-size: 1.2em;
	font-weight: bold;
`;

export const CalendarBody = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-gap: 2px;
`;

export const Date = styled.div`
	background-color: ${props => props.theme.primary}22;
	border: 1px solid ${props => props.theme.primaryLight};
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px 0;
	border-radius: 3px;
	user-select: none;

	${props => props.otherMonth && `
		color: ${props.theme.primaryLight};
	`}
	${props => props.isToday && `
		font-weight: 900;
		color: ${props.theme.primaryDark};
	`}
	${props => (props.selected || (props.mode === 'add' && props.selecting)) && `
		color: ${props.otherMonth ? 'rgba(255,255,255,.5)' : '#FFF'};
		background-color: ${props.theme.primary};
		border-color: ${props.theme.primary};
	`}
	${props => props.mode === 'remove' && props.selecting && `
		background-color: ${props.theme.primary}22;
		border: 1px solid ${props.theme.primaryLight};
		color: ${props.isToday ? props.theme.primaryDark : (props.otherMonth ? props.theme.primaryLight : 'inherit')};
	`}
`;

export const Day = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 3px 10px;
	font-weight: bold;
	user-select: none;
	opacity: .7;
`;
