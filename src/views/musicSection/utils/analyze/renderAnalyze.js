import drawBars from '@/views/musicSection/utils/analyze/drawBars';

/**
 * @description: 不同绘制模式的方法枚举
 */
const modeMap = {
	bars: drawBars,
};

/**
 * @description: 绘制频率
 */
const frameRateMap = {
	bars: 2,
	vertLines: 1,
	lightning: 2,
	doubleLine: 1,
	doubleBars: 2,
	waves: 2,
};

/**
 * @description: 频谱图显示模式
 */
const MODES = {
	BARS: 'bars',
	VERT_LINES: 'vertLines',
	LIGHTNING: 'lightning',
	DOUBLE_LINE: 'doubleLine',
	DOUBLE_BARS: 'doubleBars',
	WAVES: 'waves',
};

/**
 * @description: 处理频谱的渲染
 * @param dataArray  频谱数据
 * @param canvas  HTML元素
 * @param canvasOptions 配置项
 * @param frameCount 渲染频率计数值
 */
const renderAnalyze = (dataArray, canvas, canvasOptions = {}, frameCount) => {
	if (!canvas) {
		return;
	}
	canvasOptions = { ...canvasOptions };
	if (!canvasOptions.stroke) canvasOptions.stroke = 1;
	if (!canvasOptions.colors) canvasOptions.colors = ['#00cc65', '#87f7a2', '#007c39', '#00cc65'];

	const canvasCtx = canvas.getContext('2d');
	const height = canvas.height;
	const width = canvas.width;

	// 基于渲染设置先判断这一帧是否渲染
	if (frameCount % frameRateMap[canvasOptions.mode] === 0) {
		// 清除旧数据
		canvasCtx.clearRect(0, 0, width, height);
		canvasCtx.beginPath();
		// 调用不同模式的绘制方法
		modeMap[canvasOptions.mode]({
			dataArray,
			canvasOptions,
			canvasCtx,
			height,
			width,
		});
	}
};

export default renderAnalyze;