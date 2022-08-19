import { styled } from 'goober'

export const Wrapper = styled('div')`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--background);
  border: 1px solid var(--surface);
  z-index: 900;
  padding: 20px 26px;
  border-radius: 3px;
  width: 400px;
  box-sizing: border-box;
  max-width: calc(100% - 40px);
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.3);

  & h2 {
    margin: 0;
    font-size: 1.3rem;
  }
  & p {
    margin: 16px 0 24px;
    font-size: 1rem;
  }
`

export const ButtonWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: wrap;
`
