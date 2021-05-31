import styled from '@emotion/styled';

export const Wrapper = styled.div`
	margin: 10px 0;
`;

export const ToggleContainer = styled.div`
	display: flex;
  border: 1px solid ${props => props.theme.primary};
  border-radius: 3px;
  overflow: hidden;

  &:focus-within label {
    box-shadow: inset 0 -3px 0 0 var(--focus-color);
  }

  & > div:first-child label {
    border-end-start-radius: 2px;
  }
  & > div:last-child label {
    border-end-end-radius: 2px;
  }
`;

export const StyledLabel = styled.label`
	display: block;
	padding-bottom: 4px;
	font-size: .9rem;
`;

export const Option = styled.div`
	flex: 1;
`;

export const HiddenInput = styled.input`
  height: 0;
  width: 0;
  position: absolute;
  left: -1000px;
  opacity: 0;

  &:checked + label {
    color: ${props => props.theme.background};
    background-color: ${props => props.theme.primary};
    --focus-color: ${props => props.theme.primaryDark};
  }
`;

export const LabelButton = styled.label`
  padding: 6px;
  display: flex;
  text-align: center;
  cursor: pointer;
  user-select: none;
  height: 100%;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  transition: box-shadow .15s;
  --focus-color: ${props => props.theme.primary};
`;
