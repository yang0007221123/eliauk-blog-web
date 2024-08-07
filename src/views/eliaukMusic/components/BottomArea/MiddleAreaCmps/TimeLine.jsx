import React, { memo } from 'react';
import { TimeLineStyles } from '@/views/eliaukMusic/styles/TimeLine';
import { ConfigProvider, Slider } from 'antd';
import { changeCurrentTime } from '@/views/eliaukMusic/store/actions/audioAction';
import { shallowEqual, useSelector } from 'react-redux';
import moment from 'moment';

/**
 * @description: 歌曲时间进度条
 */
const TimeLine = () => {
	const { currentTime, duration } = useSelector(
		(state) => ({
			currentTime: state.audio.currentTime,
			duration: state.audio.duration,
		}),
		shallowEqual,
	);

	// 调节播放时间
	const onChange = (value) => {
		changeCurrentTime(value);
	};

	// 时间转换
	const formatTime = (seconds) => {
		return moment.utc(seconds * 1000).format('mm:ss');
	};

	return (
		<TimeLineStyles>
			<div className='time'>{formatTime(currentTime)}</div>
			<ConfigProvider
				theme={{
					components: {
						Slider: {
							railBg: '#ececec', // 轨道背景色
							trackBg: '#00cc65', // 已激活部分的颜色
							handleColor: '#00cc65', // 滑块颜色
							trackHoverBg: '#00cc65', // 滑块颜色
							dotActiveBorderColor: '#00cc65', // 圆点激活态边框颜色
							handleActiveOutlineColor: '#00cc65', // 滑块激活态外框色
							handleActiveColor: '#00cc65', // 滑块激活态边框色
							dotBorderColor: '#00cc65', // 圆点边框颜色
							dotSize: 5, // 滑块圆点尺寸
							handleLineWidthHover: 2, // 滑块边框宽度（悬浮态）
						},
					},
				}}>
				<Slider
					defaultValue={0}
					value={currentTime}
					min={0}
					max={duration}
					tooltip={{ formatter: null }}
					onChange={onChange}
				/>
			</ConfigProvider>
			<div className='time'>{formatTime(duration)}</div>
		</TimeLineStyles>
	);
};

export default memo(TimeLine);
