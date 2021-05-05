import styled from '@emotion/styled';

export const Wrapper = styled.div`
	overflow-x: auto;
	margin: 20px 0;
`;

export const Container = styled.div`
	display: inline-flex;
	box-sizing: border-box;
  min-width: 100%;
	align-items: flex-end;
	justify-content: center;
	padding: 0 calc(calc(100% - 600px) / 2);

	@media (max-width: 660px) {
		padding: 0 30px;
	}
`;

export const Date = styled.div`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	width: 60px;
	min-width: 60px;
	margin-bottom: 10px;
`;

export const Times = styled.div`
	display: flex;
	flex-direction: column;
	background-color: ${props => props.theme.text};
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
	margin: 1px;
	background-color: ${props => props.theme.background};

	${props => props.time.slice(2, 4) !== '00' && `
		margin-top: -1px;
		border-top: 2px solid transparent;
	`}
	${props => props.time.slice(2, 4) === '30' && `
		margin-top: -1px;
		border-top: 2px dotted ${props.theme.text};
	`}

	background-image: linear-gradient(
		${props => `${props.theme.primary}${Math.round(((props.peopleCount-props.minPeople)/(props.maxPeople-props.minPeople))*255).toString(16)}`},
		${props => `${props.theme.primary}${Math.round(((props.peopleCount-props.minPeople)/(props.maxPeople-props.minPeople))*255).toString(16)}`}
	);
`;

export const Spacer = styled.div`
	width: 12px;
	flex-shrink: 0;
`;

export const Tooltip = styled.div`
	position: fixed;
	top: ${props => props.y}px;
	left: ${props => props.x}px;
	transform: translateX(-50%);
	border: 1px solid ${props => props.theme.text};
	border-radius: 3px;
	padding: 4px 8px;
	background-color: ${props => props.theme.background}DD;
	max-width: 200px;
	pointer-events: none;
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

export const TimeLabels = styled.div`
	flex-shrink: 0;
	display: flex;
	flex-direction: column;
	width: 40px;
	padding-right: 6px;
`;

export const TimeSpace = styled.div`
	height: 10px;
	position: relative;
	border-top: 2px solid transparent;
	background: ${props => props.theme.background};
`;

export const TimeLabel = styled.label`
	display: block;
	position: absolute;
	top: -.7em;
	font-size: 12px;
	text-align: right;
	user-select: none;
	width: 100%;
`;

export const StyledMain = styled.div`
  width: 600px;
  margin: 20px auto;
  max-width: calc(100% - 60px);
`;

export const People = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  margin: 14px auto;
`;

export const Person = styled.button`
  font: inherit;
  font-size: 15px;
  border-radius: 3px;
  border: 1px solid ${props => props.theme.text};
  color: ${props => props.theme.text};
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  padding: 2px 8px;

  ${props => props.filtered && `
    background: ${props.theme.primary};
    color: ${props.theme.background};
    border-color: ${props.theme.primary};
  `}
`;
