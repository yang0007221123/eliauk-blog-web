import React, { memo } from 'react';
import { NavigationBarWrapper } from '@/views/home/css/NavigationBarStyles.js';
import { HomeOutlined, FundProjectionScreenOutlined, UpOutlined, DownOutlined, UserOutlined, CommentOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { setCurSectionId } from '@/store/modules/globalReducer';
import classNames from 'classnames';
import { handleScrollTo } from '@/utils/handleScrollPage';
import { useNavigationAnimation } from '@/hooks/useNavigationAnimation';

const NavigationBar = () => {
	const menuList = [
		{ id: 0, name: '首页' },
		{ id: 1, name: '个人学习项目' },
		{ id: 2, name: '博主简介' },
		{ id: 3, name: '留言板' }
	];
	const { currentSectionId } = useSelector(
		(state) => ({
			currentSectionId: state.global.currentSectionId
		}),
		shallowEqual
	);
	const dispatch = useDispatch();
	const scope = useNavigationAnimation(currentSectionId); // 动画

	// 向下翻页
	const handleNextPage = () => {
		if (currentSectionId === menuList.length - 1) return;
		handleScrollTo(window.innerHeight * (currentSectionId + 1));
		dispatch(setCurSectionId(currentSectionId + 1));
	};

	// 向上翻页
	const handleForwardPage = () => {
		if (currentSectionId === 0) return;
		handleScrollTo(window.innerHeight * (currentSectionId - 1));
	};

	// 点击section定位图标
	const clickSection = (id) => {
		handleScrollTo(window.innerHeight * id);
	};

	return (
		<NavigationBarWrapper>
			<div className='bar-box' ref={scope}>
				<div>
					<UpOutlined
						onClick={() => {
							handleForwardPage();
						}}
					/>
				</div>
				{menuList.map((item) => {
					return (
						<div
							key={item.id}
							className={classNames('item', item.id === currentSectionId ? 'item-active' : '')}
							onClick={() => {
								clickSection(item.id);
							}}>
							<Tooltip placement='right' title={item.name} mouseEnterDelay={0.3}>
								{item.id === 0 && <HomeOutlined />}
								{item.id === 1 && <FundProjectionScreenOutlined />}
								{item.id === 2 && <UserOutlined />}
								{item.id === 3 && <CommentOutlined />}
							</Tooltip>
						</div>
					);
				})}
				<div>
					<DownOutlined onClick={handleNextPage} />
				</div>
			</div>
		</NavigationBarWrapper>
	);
};

export default memo(NavigationBar);
