import { styled } from 'goober'
import { forwardRef } from 'react'

export const Wrapper = styled('div')`
  margin: 10px 0;
`

export const ToggleContainer = styled('div')`
  display: flex;
  border: 1px solid var(--primary);
  border-radius: 3px;
  overflow: hidden;
  --focus-color: var(--primary);
  transition: border .15s;

  &:focus-within {
    --focus-color: var(--secondary);
    border: 1px solid var(--focus-color);
    & label {
      box-shadow: inset 0 -3px 0 0 var(--focus-color);
    }
  }

  & > div:first-of-type label {
    border-end-start-radius: 2px;
  }
  & > div:last-of-type label {
    border-end-end-radius: 2px;
  }
`

export const StyledLabel = styled('label')`
  display: block;
  padding-bottom: 4px;
  font-size: .9rem;

  & svg {
    height: 1em;
    width: 1em;
    vertical-align: middle;
  }
`

export const Option = styled('div')`
  flex: 1;
  position: relative;
`

export const HiddenInput = styled('input', forwardRef)`
  height: 0;
  width: 0;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  appearance: none;

  &:checked + label {
    color: var(--background);
    background-color: var(--focus-color);
  }
`

export const LabelButton = styled('label')`
  padding: 6px;
  display: flex;
  text-align: center;
  cursor: pointer;
  user-select: none;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  transition: box-shadow .15s, background-color .15s;
`
