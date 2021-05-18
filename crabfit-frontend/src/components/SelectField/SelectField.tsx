import {
	Wrapper,
	StyledLabel,
	StyledSubLabel,
	StyledSelect,
} from './selectFieldStyle';

const SelectField = ({
	label,
	subLabel,
	id,
	options = [],
	inline = false,
	small = false,
	defaultOption,
	register,
	...props
}) => (
	<Wrapper inline={inline} small={small}>
		{label && <StyledLabel htmlFor={id} inline={inline} small={small}>{label}</StyledLabel>}
		{subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}

		<StyledSelect
			id={id}
			ref={register}
      small={small}
			{...props}
		>
			{defaultOption && <option value="">{defaultOption}</option>}
			{Array.isArray(options) ? (
        options.map(value =>
  				<option key={value} value={value}>{value}</option>
  			)
      ) : (
        Object.entries(options).map(([key, value]) =>
  				<option key={key} value={key}>{value}</option>
  			)
      )}
		</StyledSelect>
	</Wrapper>
);

export default SelectField;
