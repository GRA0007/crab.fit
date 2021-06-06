import { Pressable } from './buttonStyle';

const Button = ({ href, type = 'button', icon, children, ...props }) => (
	<Pressable
    type={href ? undefined : type}
    role={href && 'button'}
    as={href ? 'a' : 'button'}
    href={href}
    {...props}
  >
    {icon}
    {children}
  </Pressable>
);

export default Button;
