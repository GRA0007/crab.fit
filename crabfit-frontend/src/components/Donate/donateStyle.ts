import styled from '@emotion/styled';

export const Wrapper = styled.div`
  margin-top: 6px;
  margin-left: 12px;
  position: relative;
`;

export const Options = styled.div`
	position: absolute;
  bottom: calc(100% + 20px);
  right: 0;
  background-color: ${props => props.theme.background};
  ${props => props.theme.mode === 'dark' && `
    border: 1px solid ${props.theme.primaryBackground};
  `}
  z-index: 60;
  padding: 4px 10px;
  border-radius: 14px;
  box-sizing: border-box;
  max-width: calc(100vw - 20px);
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.3);

  visibility: hidden;
  pointer-events: none;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity .15s, transform .15s, visibility .15s;

  ${props => props.isOpen && `
    pointer-events: all;
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
  `}

  & img {
    width: 80px;
    margin: 10px auto 0;
    display: block;
  }

  & a {
    display: block;
    white-space: nowrap;
    text-align: center;
    padding: 4px 20px;
    margin: 6px 0;
    text-decoration: none;
    border-radius: 100px;
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.background};

    &:hover {
      text-decoration: underline;
    }
    & strong {
      font-weight: 800;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;
