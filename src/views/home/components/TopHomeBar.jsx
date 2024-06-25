import React, {memo} from 'react';
import {TopHomeBarWrapper} from '@/views/home/css/TopHomeBarStyles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {motion} from 'framer-motion';
import {useTopHomeBar} from '@/hooks/useTopHomeBar';
import {useSelector} from 'react-redux';
import {handleScrollTo} from '@/utils/handleScrollPage';
import LoginRegister from '@/views/home/components/LoginRegister';

/**
 * @description: 首页菜单导航栏
 */
const TopHomeBar = () => {
	const menuList = [
		{ id: 0, name: '首页' },
		{ id: 1, name: '学习项目' },
		{ id: 2, name: '博主简介' },
		{ id: 3, name: '留言板' }
	];
	const { variants, controls } = useTopHomeBar(); // 动态控制TopHomeBar的显示隐藏
	const { currentSectionId } = useSelector((state) => ({
		currentSectionId: state.global.currentSectionId
	}));

	return (
		<TopHomeBarWrapper>
			<motion.div className={classNames('top-home-bar')} initial={{ opacity: 0, translateY: -80 }} variants={variants} animate={controls}>
				<div className='logo-box'>
					<img className='logo' src={require('@/assets/image/logo.jpg')} alt='' />
					<div className='name'>EliaukBlog</div>
				</div>
				<div className='bar-box'>
					{menuList.map((item) => {
						return (
							<div
								key={item.id}
								className={classNames('item', currentSectionId === item.id ? 'active' : '')}
								onClick={() => {
									handleScrollTo(window.innerHeight * item.id);
								}}>
								<div className={currentSectionId === item.id ? 'active-bar' : ''}></div>
								<span>{item.name}</span>
							</div>
						);
					})}
				</div>
				{/*  登录注册 */}
				<LoginRegister></LoginRegister>
			</motion.div>
		</TopHomeBarWrapper>
	);
};

TopHomeBar.propTypes = {
	abc: PropTypes.string
};

export default memo(TopHomeBar);
