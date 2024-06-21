import styled from 'styled-components';
import { primaryColor } from '@/assets/css/variables';

export const NavigationBarWrapper = styled.div`
	position: fixed;
	right: 35px;
	top: 50%;
	transform: translateY(-50%);
	font-size: 20px;
	font-weight: 600;
	z-index: 999;

	display: flex;
	flex-direction: column;
	align-items: center;

	.anticon {
		color: #333333;
	}

	.anticon-up,
	.anticon-down {
		padding: 10px;
		font-size: 20px;
		cursor: pointer;
	}

	.bar-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 5px 0;
		${(props) => props.theme.color.firstColor};

		.item {
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: -1px;
			padding: 15px;
			border: 1px solid #2f4f4f;
			cursor: pointer;
			box-sizing: border-box;

			&:first-child {
				border-radius: 10px 10px 0 0;
			}

			&:last-child {
				border-radius: 0 0 10px 10px;
			}

			&-active {
				font-weight: 600;
				background-color: ${primaryColor};

				.anticon {
					color: #ffffff;
				}
			}
		}
	}
`;
