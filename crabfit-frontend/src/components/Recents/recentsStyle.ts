import styled from '@emotion/styled';

export const Recent = styled.a`
	text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
  flex-wrap: wrap;

  & .name {
    font-weight: 700;
    font-size: 1.1em;
    color: ${props => props.theme.primaryDark};
    flex: 1;
    display: block;
  }
  & .date {
    font-weight: 400;
    opacity: .8;
    white-space: nowrap;
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
