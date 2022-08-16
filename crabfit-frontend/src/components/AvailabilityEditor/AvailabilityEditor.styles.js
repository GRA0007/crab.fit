import { styled } from 'goober'

export const Time = styled('div')`
  height: 10px;
  touch-action: none;
  transition: background-color .1s;

  ${props => props.time.slice(2, 4) === '00' && `
    border-top: 2px solid var(--text);
  `}
  ${props => props.time.slice(2, 4) !== '00' && `
    border-top: 2px solid transparent;
  `}
  ${props => props.time.slice(2, 4) === '30' && `
    border-top: 2px dotted var(--text);
  `}

  ${props => (props.selected || (props.mode === 'add' && props.selecting)) && `
    background-color: var(--primary);
  `};
  ${props => props.mode === 'remove' && props.selecting && `
    background-color: var(--background);
  `};
`
