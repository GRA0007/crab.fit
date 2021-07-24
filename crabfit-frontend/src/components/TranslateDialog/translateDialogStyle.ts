import styled from '@emotion/styled';

export const Wrapper = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background-color: ${props => props.theme.background};
  ${props => props.theme.mode === 'dark' && `
    border: 1px solid ${props.theme.primaryBackground};
  `}
  z-index: 900;
  padding: 20px;
  border-radius: 3px;
  box-sizing: border-box;
  width: 500px;
  max-width: calc(100% - 40px);
  box-shadow: 0 3px 6px 0 rgba(0,0,0,.3);
  display: flex;
  align-items: center;

  & h2 {
    margin: 0;
    font-size: 1.3rem;
  }
  & p {
    margin: 12px 0 0;
    font-size: 1rem;
  }

  @media (max-width: 400px) {
    display: block;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  margin-left: 20px;
  white-space: nowrap;

  @media (max-width: 400px) {
    margin: 20px 0 0;
    white-space: normal;
  }
`;
