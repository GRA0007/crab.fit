import { styled } from 'goober'

export const Wrapper = styled('div')`
  position: fixed;
  background: rgba(0,0,0,.6);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
`

export const Image = styled('img')`
  max-width: 80%;
  max-height: 80%;
  position: absolute;
`
