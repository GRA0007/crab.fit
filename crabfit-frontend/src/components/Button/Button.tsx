import { Pressable } from './buttonStyle';

const Button = ({ href, type = 'button', ...props }) => (
	<Pressable
    type={href ? undefined : type}
    role="button"
    as={href ? 'a' : 'button'}
    href={href}
    {...props}
  />
);

export default Button;
