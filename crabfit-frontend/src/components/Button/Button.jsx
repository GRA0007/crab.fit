import { Pressable } from './Button.styles'

const Button = ({
  href,
  type = 'button',
  icon,
  children,
  secondary,
  primaryColor,
  secondaryColor,
  small,
  size,
  isLoading,
  ...props
}) => (
  <Pressable
    type={type}
    as={href ? 'a' : 'button'}
    href={href}
    $secondary={secondary}
    $primaryColor={primaryColor}
    $secondaryColor={secondaryColor}
    $small={small}
    $size={size}
    $isLoading={isLoading}
    {...props}
  >
    {icon}
    {children}
  </Pressable>
)

export default Button
