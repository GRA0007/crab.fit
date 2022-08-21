import { styled } from 'goober'

export const Wrapper = styled('div')`
  margin: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & label:last-of-type {
    text-align: right;
  }

  @media (max-width: 400px) {
    display: block;
  }
`

export const Label = styled('label')`
  display: block;
  font-size: 14px;
  text-align: left;
`

export const Bar = styled('div')`
  display: flex;
  width: 40%;
  height: 20px;
  border-radius: 3px;
  overflow: hidden;
  margin: 0 8px;
  border: 1px solid var(--text);

  @media (max-width: 400px) {
    width: 100%;
    margin: 8px 0;
  }
`

export const Grade = styled('div')`
  flex: 1;
  background-color: ${props => props.$color};

  ${props => props.$highlight && `
    background-image: repeating-linear-gradient(
      45deg,
      transparent,
      transparent 4.5px,
      rgba(0,0,0,.5) 4.5px,
      rgba(0,0,0,.5) 9px
    );
  `}
`
