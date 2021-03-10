import styled from '@emotion/styled';

export const Wrapper = styled.div`
	margin: 10px 0;
`;

export const ToggleContainer = styled.div`
	display: flex;
  border: 1px solid ${props => props.theme.primary};
  border-radius: 3px;
  overflow: hidden;
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
  right: -1000px;
  top: 0;

  &:checked + label {
    color: ${props => props.theme.background};
    background-color: ${props => props.theme.primary};
  }
`;

export const LabelButton = styled.label`
  padding: 6px;
  display: block;
  text-align: center;
  cursor: pointer;
  user-select: none;
`;
