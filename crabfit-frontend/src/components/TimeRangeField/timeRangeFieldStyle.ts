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

export const Range = styled.div`
	user-select: none;
	background-color: ${props => props.theme.primaryBackground};
	border: 1px solid ${props => props.theme.primaryLight};
	border-radius: 3px;
	height: 50px;
	position: relative;
	margin: 38px 6px 18px;
`;

export const Handle = styled.div`
	height: calc(100% + 20px);
	width: 20px;
	border: 1px solid ${props => props.theme.primary};
	background-color: ${props => props.theme.primaryLight};
	border-radius: 3px;
	position: absolute;
	top: -10px;
	left: calc(${props => props.value * 4.1666666666666666}% - 11px);
	cursor: ew-resize;
	touch-action: none;

	&:after {
		content: '|||';
		font-size: 8px;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: ${props => props.theme.primaryDark};
	}

	&:before {
		content: '${props => props.label}';
		position: absolute;
		bottom: calc(100% + 8px);
		text-align: center;
		left: 50%;
		transform: translateX(-50%);
    white-space: nowrap;
    ${props => props.extraPadding}
	}
`;

export const Selected = styled.div`
	position: absolute;
	height: 100%;
	left: ${props => props.start * 4.1666666666666666}%;
	right: calc(100% - ${props => props.end * 4.1666666666666666}%);
	top: 0;
	background-color: ${props => props.theme.primary};
	border-radius: 2px;
`;
