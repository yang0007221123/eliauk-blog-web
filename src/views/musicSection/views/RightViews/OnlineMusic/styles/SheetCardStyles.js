import styled from 'styled-components';
import { music_green_select } from '@/assets/css/variables';

export const SheetCardStyles = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: flex-start;
	margin-right: 20px;

	.card {
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		position: relative;
		cursor: pointer;
	}

	.image {
		width: 100%;
		height: 100%;
		border-radius: 10px;
	}

	.mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		border-radius: 10px;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.icon-icon_qqyinyue {
		position: absolute;
		top: 5px;
		left: 5px;
		color: #eaeaea;
		font-size: 20px;
	}

	.play-btn {
		width: 35px;
		height: 30px;
		position: absolute;
		bottom: 10px;
		left: 10px;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: ${music_green_select};
		border-radius: 15px;

		.icon-bofang {
			color: #ffffff;
			font-size: 22px;
		}
	}
`;