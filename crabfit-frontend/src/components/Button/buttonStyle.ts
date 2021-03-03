import styled from '@emotion/styled';

export const Wrapper = styled.div`
	display: inline-block;
	position: relative;

	--btn-height: ${props => props.buttonHeight || '40px'};
	--btn-width: ${props => props.buttonWidth || '100px'};

	height: var(--btn-height);
	width: var(--btn-width);
`;

export const Top = styled.button`
	border: 0;
	cursor: pointer;
	font: inherit;
	box-sizing: border-box;
	background: ${props => props.theme.primary};
	color: #FFF;
	font-weight: 600;
	text-shadow: 0 -1.5px .5px ${props => props.theme.primaryDark};
	padding: 0;
	border-radius: 3px;
	height: var(--btn-height);
	width: var(--btn-width);
	position: absolute;
	top: -4px;
	left: 0;
	user-select: none;
	transition: top .15s;
	outline: none;

	&:active {
		top: 0;
	}
	&:focus-visible {
		filter: brightness(1.2);
	}

	${props => props.isLoading && `
		text-shadow: none;
		color: transparent;
		cursor: wait;

		@keyframes load {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		&:after {
			content: '';
			position: absolute;
			top: calc(50% - 12px);
			left: calc(50% - 12px);
			height: 18px;
			width: 18px;
			border: 3px solid #FFF;
			border-left-color: transparent;
			border-radius: 100px;
			animation: load .5s linear infinite;
		}
	`}
`;

export const Bottom = styled.div`
	box-sizing: border-box;
	background: ${props => props.theme.primaryDark};
	border-radius: 3px;
	height: var(--btn-height);
	width: var(--btn-width);
`;
