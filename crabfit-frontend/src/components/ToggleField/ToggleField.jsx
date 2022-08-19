import { Info } from 'lucide-react'

import {
  Wrapper,
  ToggleContainer,
  StyledLabel,
  Option,
  HiddenInput,
  LabelButton,
} from './ToggleField.styles'

const ToggleField = ({
  label,
  name,
  title = '',
  options = [],
  value,
  onChange,
  inputRef,
}) => (
  <Wrapper>
    {label && <StyledLabel title={title}>{label} {title !== '' && <Info />}</StyledLabel>}

    <ToggleContainer>
      {Object.entries(options).map(([key, label]) =>
        <Option key={label}>
          <HiddenInput
            type="radio"
            name={name}
            value={label}
            id={`${name}-${label}`}
            checked={value === key}
            onChange={() => onChange(key)}
            ref={inputRef}
          />
          <LabelButton htmlFor={`${name}-${label}`}>{label}</LabelButton>
        </Option>
      )}
    </ToggleContainer>
  </Wrapper>
)

export default ToggleField
