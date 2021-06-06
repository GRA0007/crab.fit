import { forwardRef } from 'react';
import {
	Wrapper,
	StyledLabel,
	StyledSubLabel,
	StyledSelect,
} from './selectFieldStyle';

const SelectField = forwardRef(({
	label,
	subLabel,
	id,
	options = [],
	inline = false,
	small = false,
	defaultOption,
	...props
}, ref) => (
	<Wrapper inline={inline} small={small}>
		{label && <StyledLabel htmlFor={id} inline={inline} small={small}>{label}</StyledLabel>}
		{subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}

		<StyledSelect
			id={id}
      small={small}
      ref={ref}
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
));

export default SelectField;
