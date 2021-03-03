import styled from '@emotion/styled';

export const Wrapper = styled.div`
	margin: 20px 0;
	border-radius: 3px;
	background-color: ${props => props.theme.error};
	color: #FFFFFF;
	padding: 12px 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 18px;
`;

export const CloseButton = styled.button`
	border: 0;
	background: none;
	height: 30px;
	width: 30px;
	cursor: pointer;
	color: inherit;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: 16px;
`;
