import { styled } from 'goober'
import { forwardRef } from 'react'

export const Wrapper = styled('div', forwardRef)`
  overflow-y: visible;
  margin: 20px 0;
  position: relative;
`

export const ScrollWrapper = styled('div')`
  overflow-x: auto;
`

export const Container = styled('div')`
  display: inline-flex;
  box-sizing: border-box;
  min-width: 100%;
  align-items: flex-end;
  justify-content: center;
  padding: 0 calc(calc(100% - 600px) / 2);

  @media (max-width: 660px) {
    padding: 0 30px;
  }
`

export const Date = styled('div')`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 60px;
  min-width: 60px;
  margin-bottom: 10px;
`

export const Times = styled('div')`
  display: flex;
  flex-direction: column;

  border-bottom: 2px solid var(--text);
  border-left: 1px solid var(--text);
  border-right: 1px solid var(--text);

  ${props => props.$borderLeft && `
    border-left: 2px solid var(--text);
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  `}
  ${props => props.$borderRight && `
    border-right: 2px solid var(--text);
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  `}

  & .time + .timespace, & .timespace:first-of-type {
    border-top: 2px solid var(--text);
  }
`

export const DateLabel = styled('label')`
  display: block;
  font-size: 12px;
  text-align: center;
  user-select: none;
`

export const DayLabel = styled('label')`
  display: block;
  font-size: 15px;
  text-align: center;
  user-select: none;
`

export const Time = styled('div')`
  height: 10px;
  background-origin: border-box;
  transition: background-color .1s;

  ${props => props.$time.slice(2, 4) === '00' && `
    border-top: 2px solid var(--text);
  `}
  ${props => props.$time.slice(2, 4) !== '00' && `
    border-top: 2px solid transparent;
  `}
  ${props => props.$time.slice(2, 4) === '30' && `
    border-top: 2px dotted var(--text);
  `}

  background-color: ${props => `#F79E00${Math.round((props.$peopleCount/props.$maxPeople)*255).toString(16)}`};

  ${props => props.$highlight && props.$peopleCount === props.$maxPeople && props.$peopleCount > 0 && `
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4.3px,
      var(--shadow) 4.3px,
      var(--shadow) 8.6px
    );
  `}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`

export const Spacer = styled('div')`
  width: 12px;
  flex-shrink: 0;
`

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

export const TimeLabels = styled('div')`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  width: 40px;
  padding-right: 6px;
`

export const TimeSpace = styled('div')`
  height: 10px;
  position: relative;
  border-top: 2px solid transparent;

  &.timespace {
    background-origin: border-box;
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4.3px,
      var(--loading) 4.3px,
      var(--loading) 8.6px
    );
  }
`

export const TimeLabel = styled('label')`
  display: block;
  position: absolute;
  top: -.7em;
  font-size: 12px;
  text-align: right;
  user-select: none;
  width: 100%;
`

export const StyledMain = styled('div')`
  width: 600px;
  margin: 20px auto;
  max-width: calc(100% - 60px);
`

export const People = styled('div')`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  justify-content: center;
  margin: 14px auto;
`

export const Person = styled('button')`
  font: inherit;
  font-size: 15px;
  border-radius: 3px;
  border: 1px solid var(--text);
  color: var(--text);
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  padding: 2px 8px;
  user-select: none;

  ${props => props.$filtered && `
    background: var(--primary);
    color: #FFFFFF;
    border-color: var(--primary);
  `}
`

export const Info = styled('span')`
  display: block;
  text-align: center;

  @media print {
    display: none;
  }
`
