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
	register,
	...props
}) => (
	<Wrapper inline={inline}>
		{label && <StyledLabel htmlFor={id} inline={inline}>{label}</StyledLabel>}
		{subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}

		<StyledSelect
			id={id}
			ref={register}
			{...props}
		>
			<option value="">Select...</option>
			{options.map((value, i) =>
				<option key={i} value={value}>{value}</option>
			)}
		</StyledSelect>
	</Wrapper>
);

export default SelectField;
