import React, { memo } from 'react';
import { Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { LoginContentStyles } from '@/views/LoginRegisterDialog/styles/LoginContentStyles';
import SvgIcon from '@/components/SvgIcon';
import { useDispatch } from 'react-redux';
import { setToken } from '@/store/modules/userReducer';

const LoginContent = ({ setAnimateMode }) => {
	const dispatch = useDispatch();
	// 提交登录数据
	const onFinish = (value) => {
		console.log('onFinish', value);
		dispatch(setToken('888'));
	};

	return (
		<LoginContentStyles>
			<div className='left'>
				<img src={require('@/assets/image/login/login-bg.png')} alt='' />
			</div>
			<div className='right'>
				<div className='title'>
					<img src={require('@/assets/image/logo.jpg')} alt='' />
					<div className='text'>EliaukBlog</div>
				</div>
				<div className='sub-title'>
					<SvgIcon name='expression-1' width={26} height={26}></SvgIcon>欢迎登录~
				</div>
				<div className='input-box'>
					<Form name='loginForm' initialValues={{ remember: true }} onFinish={onFinish}>
						<Form.Item name='username' rules={[{ required: true, message: '请输入用户名' }]}>
							<Input placeholder='请输入用户名' allowClear prefix={<UserOutlined />} />
						</Form.Item>
						<Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
							<Input.Password placeholder='请输入密码' prefix={<LockOutlined />} />
						</Form.Item>
						<Form.Item>
							<Button type='primary' htmlType='submit'>
								登录
							</Button>
						</Form.Item>
					</Form>
				</div>
				<div className='tip-text'>
					<span>暂无账号？</span>
					<span
						className='text'
						onClick={() => {
							setAnimateMode(4);
						}}>
						前往注册
					</span>
				</div>
			</div>
		</LoginContentStyles>
	);
};

LoginContent.propTypes = {
	setAnimateMode: PropTypes.func
};

export default memo(LoginContent);
