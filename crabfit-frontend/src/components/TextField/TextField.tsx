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
	register,
	...props
}) => (
	<Wrapper>
		{label && <StyledLabel htmlFor={id}>{label}</StyledLabel>}
		{subLabel && <StyledSubLabel htmlFor={id}>{subLabel}</StyledSubLabel>}
		<StyledInput id={id} ref={register} {...props} />
	</Wrapper>
);

export default TextField;
