import { Wrapper, Top, Bottom } from './buttonStyle';

const Button = ({
	buttonHeight,
	buttonWidth,
	...props
}) => (
	<Wrapper buttonHeight={buttonHeight} buttonWidth={buttonWidth}>
		<Top {...props} />
		<Bottom />
	</Wrapper>
);

export default Button;
