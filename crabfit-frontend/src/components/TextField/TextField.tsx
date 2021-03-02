import {
	Wrapper,
	StyledLabel,
	StyledSubLabel,
	StyledInput,
} from './textFieldStyle';

const TextField = ({
	label,
	subLabel,
	id,
	inline = false,
	register,
	...props
}) => (
	<Wrapper inline={inline}>
		{label && <StyledLabel htmlFor={id} inline={inline}>{label}</StyledLabel>}
		{subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}
		<StyledInput id={id} ref={register} {...props} />
	</Wrapper>
);

export default TextField;
