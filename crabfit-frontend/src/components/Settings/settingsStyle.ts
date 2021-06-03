import styled from '@emotion/styled';

export const OpenButton = styled.button`
	border: 0;
	background: none;
	height: 50px;
	width: 50px;
	cursor: pointer;
	color: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 200;
  border-radius: 100%;
  transition: background-color .15s;
  transition: transform .15s;
  padding: 0;

  &:focus {
    outline: 0;
  }
  &:focus-visible {
    background-color: ${props => props.theme.text}22;
  }

  ${props => props.isOpen && `
    transform: rotate(-45deg);
  `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Cover = styled.div`
	position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: none;

  ${props => props.isOpen && `
    display: block;
  `}
`;

export const Modal = styled.div`
	position: absolute;
  top: 70px;
  right: 12px;
  background-color: ${props => props.theme.background};
  ${props => props.theme.mode === 'dark' && `
    border: 1px solid ${props.theme.primaryBackground};
  `}
  z-index: 150;
  padding: 10px 18px;
  border-radius: 3px;
  width: 270px;
  box-sizing: border-box;
  max-width: calc(100% - 20px);
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.3);

  pointer-events: none;
  opacity: 0;
  transform: translateY(-10px);
  visibility: hidden;
  transition: opacity .15s, transform .15s, visibility .15s;

  ${props => props.isOpen && `
    pointer-events: all;
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const Heading = styled.span`
	font-size: 1.5rem;
  display: block;
  margin: 6px 0;
  line-height: 1em;
`;
