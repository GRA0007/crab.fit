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

export const CalendarDays = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-gap: 2px;
`;

export const Day = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 3px 0;
	font-weight: bold;
	user-select: none;
	opacity: .7;

	@media (max-width: 350px) {
		font-size: 12px;
	}
`;

export const CalendarBody = styled.div`
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	grid-gap: 2px;

	& button:first-of-type {
		border-top-left-radius: 3px;
	}
	& button:nth-of-type(7) {
		border-top-right-radius: 3px;
	}
	& button:nth-last-of-type(7) {
		border-bottom-left-radius: 3px;
	}
	& button:last-of-type {
		border-bottom-right-radius: 3px;
	}
`;

export const Date = styled.button`
  font: inherit;
  color: inherit;
  background: none;
  border: 0;
  margin: 0;
  appearance: none;

	background-color: ${props => props.theme.primaryBackground};
	border: 1px solid ${props => props.theme.primaryLight};
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px 0;
	user-select: none;
	touch-action: none;

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
		background-color: ${props.theme.primaryBackground};
		border: 1px solid ${props.theme.primaryLight};
		color: ${props.isToday ? props.theme.primaryDark : (props.otherMonth ? props.theme.primaryLight : 'inherit')};
	`}
`;
