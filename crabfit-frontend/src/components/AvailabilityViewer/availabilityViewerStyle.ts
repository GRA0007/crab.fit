import styled from '@emotion/styled';

export const Wrapper = styled.div`
	overflow-x: auto;
	margin: 20px 0;
`;

export const Container = styled.div`
	display: inline-flex;
	box-sizing: border-box;
  min-width: 100%;
	align-items: flex-start;
	padding: 0 calc(calc(100% - 600px) / 2);
`;

export const Date = styled.div`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	width: 60px;
	min-width: 60px;

	& .time:last-of-type {
		border-bottom: 1px solid ${props => props.theme.primaryDark};
	}
	&.last > .time {
		border-right: 1px solid ${props => props.theme.primaryDark};
	}
`;

export const DateLabel = styled.label`
	display: block;
	font-size: 12px;
	text-align: center;
	user-select: none;
`;

export const DayLabel = styled.label`
	display: block;
	font-size: 15px;
	text-align: center;
	user-select: none;
`;

export const Time = styled.div`
	height: 10px;
	border-left: 1px solid ${props => props.theme.primaryDark};

	${props => props.time.slice(-2) === '00' && `
		border-top: 1px solid ${props.theme.primaryDark};
	`}
	${props => props.time.slice(-2) === '30' && `
		border-top: 1px dotted ${props.theme.primaryDark};
	`}

	background-color: ${props => `${props.theme.primary}${Math.round((props.people.length/(props.totalPeople))*255).toString(16)}`};
`;

export const Spacer = styled.div`
	width: 12px;
	flex-shrink: 0;
`;

export const Tooltip = styled.div`
	position: fixed;
	top: ${props => props.y+6}px;
	left: ${props => props.x+6}px;
	border: 1px solid ${props => props.theme.text};
	border-radius: 3px;
	padding: 4px 8px;
	background-color: ${props => props.theme.background};
	max-width: 200px;
`;

export const TooltipTitle = styled.span`
	font-size: 15px;
	display: block;
	font-weight: 700;
`;

export const TooltipDate = styled.span`
	font-size: 13px;
	display: block;
	opacity: .7;
	font-weight: 700;
`;

export const TooltipContent = styled.span`
	font-size: 13px;
	display: block;
`;
