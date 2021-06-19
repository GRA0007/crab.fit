import styled from '@emotion/styled';

export const Wrapper = styled.div`
  @media print {
    display: none;
  }
`;

export const Recent = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  flex-wrap: wrap;

  & .name {
    font-weight: 700;
    font-size: 1.1em;
    color: ${props => props.theme.mode === 'light' ? props.theme.primaryDark : props.theme.primaryLight};
    flex: 1;
    display: block;
  }
  & .date {
    font-weight: 400;
    opacity: .8;
    white-space: nowrap;
    color: ${props => props.theme.text};
  }

  &:hover .name {
    text-decoration: underline;
  }

  @media (max-width: 500px) {
    display: block;

    & .date {
      white-space: normal;
    }
  }
`;
