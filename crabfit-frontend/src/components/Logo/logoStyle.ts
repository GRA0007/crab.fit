import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const A = styled.a`
  text-decoration: none;

  @keyframes jelly {
    from,to {
      transform: scale(1,1)
    }
    25% {
      transform: scale(.9,1.1)
    }
    50% {
      transform: scale(1.1,.9)
    }
    75% {
      transform: scale(.95,1.05)
    }
  }

  &:hover img {
    animation: jelly .5s 1;
  }
  @media (prefers-reduced-motion: reduce) {
    &:hover img {
      animation: none;
    }
  }
`;

export const Top = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

export const Image = styled.img`
  width: 2.5rem;
  margin-right: 16px;
`;

export const Title = styled.span`
  display: block;
  font-size: 2rem;
  color: ${props => props.theme.primary};
  font-family: 'Molot', sans-serif;
  font-weight: 400;
  text-shadow: 0 2px 0 ${props => props.theme.primaryDark};
  line-height: 1em;
`;

export const Tagline = styled.span`
  text-decoration: underline;
  font-size: 14px;
  padding-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
