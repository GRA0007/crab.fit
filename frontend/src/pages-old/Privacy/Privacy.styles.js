import { styled } from 'goober'

export const Note = styled('p')`
  background-color: var(--surface);
  border: 1px solid var(--primary);
  border-radius: 10px;
  padding: 12px 16px;
  margin: 16px 0;
  box-sizing: border-box;
  font-weight: 500;
  line-height: 1.6em;

  & a {
    color: var(--secondary);
  }
`

export const ButtonArea = styled('div')`
  @media print {
    display: none;
  }
`
