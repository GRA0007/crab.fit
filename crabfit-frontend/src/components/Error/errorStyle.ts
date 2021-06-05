import styled from '@emotion/styled';

export const Wrapper = styled.div`
	border-radius: 3px;
	background-color: ${props => props.theme.error};
	color: #FFFFFF;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 18px;
  opacity: 0;
  max-height: 0;
  margin: 0;
  visibility: hidden;
  transition: margin .2s, max-height .2s;

  ${props => props.open && `
    opacity: 1;
    visibility: visible;
    margin: 20px 0;
    max-height: 60px;
    transition: opacity .15s .2s, max-height .2s, margin .2s, visibility .2s;
  `}
  
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const CloseButton = styled.button`
	border: 0;
	background: none;
	height: 30px;
	width: 30px;
	cursor: pointer;
	color: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 16px;
`;
