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
      {Object.entries(options).map(([key, label]) =>
        <Option key={label}>
          <HiddenInput
            type="radio"
            name={name}
            value={label}
            id={`${name}-${label}`}
            checked={value === key}
            onChange={() => onChange(key)}
          />
          <LabelButton htmlFor={`${name}-${label}`}>{label}</LabelButton>
        </Option>
      )}
    </ToggleContainer>
	</Wrapper>
);

export default ToggleField;
