import {
	Wrapper,
  ToggleContainer,
	StyledLabel,
	Option,
	HiddenInput,
  LabelButton,
} from './toggleFieldStyle';

const ToggleField = ({
	label,
	id,
  name,
  title = '',
	options = [],
  value,
  onChange,
	...props
}) => (
	<Wrapper>
		{label && <StyledLabel title={title}>{label}</StyledLabel>}

    <ToggleContainer>
      {options.map(option =>
        <Option key={option}>
          <HiddenInput
            type="radio"
            name={name}
            value={option}
            id={`${name}-${option}`}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <LabelButton htmlFor={`${name}-${option}`}>{option}</LabelButton>
        </Option>
      )}
    </ToggleContainer>
	</Wrapper>
);

export default ToggleField;
