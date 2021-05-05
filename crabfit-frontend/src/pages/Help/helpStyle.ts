import styled from '@emotion/styled';

export const StyledMain = styled.div`
	width: 600px;
	margin: 20px auto;
	max-width: calc(100% - 60px);
`;

export const Logo = styled.img`
	width: 2.5rem;
	margin-right: 16px;
`;

export const Title = styled.span`
	display: block;
	font-size: 2rem;
	color: ${props => props.theme.primary};
	font-family: 'Molot', sans-serif;
	font-weight: 400;
	text-shadow: 0 2px 0 ${props => props.theme.primaryDark};
	line-height: 1em;
`;

export const AboutSection = styled.section`
	margin: 30px 0 0;
	background-color: ${props => props.theme.primaryBackground};
	padding: 20px 0;
`;

export const P = styled.p`
	font-weight: 500;
	line-height: 1.6em;
`;

export const Step = styled.h2`
	text-decoration-color: ${props => props.theme.primary};
  text-decoration-style: solid;
  text-decoration-line: underline;
  margin-top: 30px;
`;

export const FakeCalendar = styled.div`
	user-select: none;

  & div {
    display: grid;
  	grid-template-columns: repeat(7, 1fr);
  	grid-gap: 2px;
  }
  & .days span {
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
  }
  & .dates span {
    background-color: ${props => props.theme.primaryBackground};
  	border: 1px solid ${props => props.theme.primaryLight};
  	display: flex;
  	align-items: center;
  	justify-content: center;
  	padding: 10px 0;

    &.selected {
      color: #FFF;
  		background-color: ${props => props.theme.primary};
  		border-color: ${props => props.theme.primary};
    }
  }
`;

export const FakeTimeRange = styled.div`
	user-select: none;
  background-color: ${props => props.theme.primaryBackground};
	border: 1px solid ${props => props.theme.primaryLight};
	border-radius: 3px;
	height: 50px;
	position: relative;
	margin: 38px 6px 18px;

  & div {
    height: calc(100% + 20px);
  	width: 20px;
  	border: 1px solid ${props => props.theme.primary};
  	background-color: ${props => props.theme.primaryLight};
  	border-radius: 3px;
  	position: absolute;
  	top: -10px;

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
  		content: attr(data-label);
  		position: absolute;
  		bottom: calc(100% + 8px);
  		text-align: center;
  		left: 50%;
  		transform: translateX(-50%);
  	}
  }
  & .start {
    left: calc(${11 * 4.1666666666666666}% - 11px);
  }
  & .end {
    left: calc(${17 * 4.1666666666666666}% - 11px);
  }
  &:before {
    content: '';
    position: absolute;
  	height: 100%;
  	left: ${11 * 4.1666666666666666}%;
  	right: calc(100% - ${17 * 4.1666666666666666}%);
  	top: 0;
  	background-color: ${props => props.theme.primary};
  	border-radius: 2px;
  }
`;
