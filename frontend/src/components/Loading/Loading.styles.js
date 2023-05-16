import { styled } from 'goober'

export const Wrapper = styled('main')`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
`

export const Loader = styled('div')`
  @keyframes load {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  height: 24px;
  width: 24px;
  border: 3px solid var(--primary);
  border-left-color: transparent;
  border-radius: 100px;
  animation: load .5s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    border: 0;

    &::before {
      content: 'loading...';
    }
  }
`
