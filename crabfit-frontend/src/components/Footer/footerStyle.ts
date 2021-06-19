import styled from '@emotion/styled';

export const Wrapper = styled.footer`
  width: 600px;
  margin: 20px auto;
  max-width: calc(100% - 60px);
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${props => props.small && `
    margin: 60px auto 0;
    width: 250px;
    max-width: initial;
    display: block;

    & span {
      display: block;
      margin-bottom: 20px;
    }
  `}
`;
