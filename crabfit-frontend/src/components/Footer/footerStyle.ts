import styled from '@emotion/styled';

export const Wrapper = styled.footer`
	width: 600px;
	margin: 20px auto;
	max-width: calc(100% - 60px);
	display: flex;
	align-items: center;
	justify-content: space-between;

  ${props => props.donateMode && `
    flex-wrap: wrap;
  `}
`;

export const Link = styled.a`
	padding: 11px 10px;
  white-space: nowrap;

  & strong {
    font-weight: 800;
  }
`;
