import styled from '@emotion/styled';

export const Time = styled.div`
  height: 10px;
  touch-action: none;
  transition: background-color .1s;

  ${props => props.time.slice(2, 4) === '00' && `
    border-top: 2px solid ${props.theme.text};
  `}
  ${props => props.time.slice(2, 4) !== '00' && `
    border-top: 2px solid transparent;
  `}
  ${props => props.time.slice(2, 4) === '30' && `
    border-top: 2px dotted ${props.theme.text};
  `}

  ${props => (props.selected || (props.mode === 'add' && props.selecting)) && `
    background-color: ${props.theme.primary};
  `};
  ${props => props.mode === 'remove' && props.selecting && `
    background-color: ${props.theme.background};
  `};
`;
