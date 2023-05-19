import { styled } from 'goober'

export const StyledMain = styled('div')`
  width: 600px;
  margin: 10px auto;
  max-width: calc(100% - 30px);
`

export const CreateForm = styled('form')`
  margin: 0 0 30px;
`

export const TitleSmall = styled('span')`
  display: block;
  margin: 0;
  font-size: 2rem;
  text-align: center;
  font-family: 'Samurai Bob', sans-serif;
  font-weight: 400;
  color: var(--secondary);
  line-height: 1em;
  text-transform: uppercase;
`

export const TitleLarge = styled('h1')`
  margin: 0;
  font-size: 2rem;
  text-align: center;
  color: var(--primary);
  font-family: 'Molot', sans-serif;
  font-weight: 400;
  text-shadow: 0 3px 0 var(--secondary);
  line-height: 1em;
  text-transform: uppercase;
`

export const P = styled('p')`
  font-weight: 500;
  line-height: 1.6em;
`

export const OfflineMessage = styled('div')`
  text-align: center;
  margin: 50px 0 20px;
`

export const ShareInfo = styled('p')`
  margin: 6px 0;
  text-align: center;
  font-size: 15px;
  padding: 10px 0;

  ${props => props.onClick && `
    cursor: pointer;

    &:hover {
      color: var(--secondary);
    }
  `}
`
