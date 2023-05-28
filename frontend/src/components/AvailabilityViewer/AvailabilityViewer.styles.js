import { styled } from 'goober'

export const Tooltip = styled('div')`
  position: absolute;
  top: ${props => props.$y}px;
  left: ${props => props.$x}px;
  transform: translateX(-50%);
  border: 1px solid var(--text);
  border-radius: 3px;
  padding: 4px 8px;
  background-color: var(--background);
  max-width: 200px;
  pointer-events: none;
  z-index: 100;
  user-select: none;
`

export const TooltipTitle = styled('span')`
  font-size: 15px;
  display: block;
  font-weight: 700;
`

export const TooltipDate = styled('span')`
  font-size: 13px;
  display: block;
  opacity: .8;
  font-weight: 600;
`

export const TooltipContent = styled('div')`
  font-size: 13px;
  padding: 4px 0;
`

export const TooltipPerson = styled('span')`
  display: inline-block;
  margin: 2px;
  padding: 1px 4px;
  border: 1px solid var(--primary);
  border-radius: 3px;

  ${props => props.disabled && `
    opacity: .5;
    border-color: var(--text);
  `}
`
