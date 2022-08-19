import { X } from 'lucide-react'

import { Wrapper, CloseButton } from './Error.styles'

const Error = ({
  children,
  onClose,
  open = true,
  ...props
}) => (
  <Wrapper role="alert" open={open} {...props}>
    {children}
    <CloseButton type="button" onClick={onClose} title="Close error"><X /></CloseButton>
  </Wrapper>
)

export default Error
