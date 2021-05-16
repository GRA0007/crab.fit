import { Wrapper, Top, Bottom } from './buttonStyle';

const Button = ({
	buttonHeight,
	buttonWidth,
  primaryColor,
  secondaryColor,
	...props
}) => (
	<Wrapper buttonHeight={buttonHeight} buttonWidth={buttonWidth}>
		<Top primaryColor={primaryColor} secondaryColor={secondaryColor} {...props} />
		<Bottom secondaryColor={secondaryColor} />
	</Wrapper>
);

export default Button;
