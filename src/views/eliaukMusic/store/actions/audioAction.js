import store from '@/store';
import {
	deleteSongById,
	setCurrentTime,
	setDuration,
	setIsEnded,
	setIsMuted,
	setIsPause,
	setIsPlaying,
	setMusicMode,
	setPlaybackRate,
	setSongId,
	setSongList,
	setSongUrl,
	setVolume,
} from '@/views/eliaukMusic/store/modules/audioReducer';
import MessageToast from '@/components/MessageToast';

const dispatch = store.dispatch;
export const audio = new Audio(); // 初始化audio
audio.autoplay = false;

/**
 * @description: 下一首
 * @param manualFlag ：true-手动点击下一首时，直接下一首； false-自然结束下一首时，要考虑musicMode
 */
export const playNextSong = async (manualFlag) => {
	let { songList, songId, musicMode } = store.getState().audio;
	console.log('playNextSong', musicMode);
	let nextSong;
	/* 顺序播放、 单曲循环时主动下一首 */
	if (musicMode === 1 || (musicMode === 3 && manualFlag)) {
		let index = songList?.findIndex((item) => item.songId === songId);
		index = index === songList?.length - 1 ? 0 : index + 1; // 是否最后一首
		nextSong = songList[index]; // 找到下一首
	}
	/* 随机播放 */
	if (musicMode === 2) {
		nextSong = getRandomSong(songList, songId);
	}
	/* 单曲循环且不是主动切换 */
	if (musicMode === 3 && !manualFlag) {
		nextSong = songList?.find((item) => item.songId === songId);
	}
	// 重置状态
	dispatch(setSongId(nextSong.songId));
	dispatch(setSongUrl(nextSong.songUrl));
	dispatch(setIsPlaying(false));
	dispatch(setIsPause(false));
	dispatch(setIsEnded(true));
	dispatch(setCurrentTime(0));
	dispatch(setDuration(0));
	// 播放
	await playAudio();
};

/**
 * @description: 实现随机效果
 * @param songList  当前歌曲列表
 * @param songId 当前歌曲的id
 * @return songList[randomIndex] 随机歌曲信息
 */
const getRandomSong = (songList, songId) => {
	if (songList.length === 1) {
		return 0; // 如果只有一首歌，直接返回索引0
	}
	let randomIndex = Math.floor(Math.random() * songList.length);
	// 如果随机到的索引与上次播放的索引相同，重新生成，直到不同为止
	const curSongIndex = songList.findIndex((item) => item.songId === songId);
	if (randomIndex === curSongIndex) {
		randomIndex = Math.floor(Math.random() * songList.length);
		console.log('randomIndex', randomIndex);
	}
	return songList[randomIndex];
};

/**
 * @description: 上一首
 */
export const playPreSong = async () => {
	console.log('playPreSong');
	let { songList, songId, musicMode } = store.getState().audio;
	let preSong;
	/* 顺序播放模式 或者 单曲循环模式 */
	if (musicMode === 1 || musicMode === 3) {
		let index = songList?.findIndex((item) => item.songId === songId);
		index = index === 0 ? songList?.length - 1 : index - 1; // 是否第一首
		preSong = songList[index]; // 找到上一首
	}
	/* 随机播放模式  */
	if (musicMode === 2) {
		preSong = getRandomSong(songList, songId);
	}
	// 重置状态
	dispatch(setSongId(preSong.songId));
	dispatch(setSongUrl(preSong.songUrl));
	dispatch(setIsPlaying(false));
	dispatch(setIsPause(false));
	dispatch(setIsEnded(true));
	dispatch(setCurrentTime(0));
	dispatch(setDuration(0));
	// 播放
	await playAudio();
};

/**
 * @description: 获取频谱分析器
 */
let analyser = null;
export const getAnalyser = () => {
	return analyser;
};

/**
 * @description: 创建频谱分析器
 */
const createAnalyzer = () => {
	const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // 创建处理音频的对象
	analyser = audioContext.createAnalyser(); // 创建频谱分析对象
	analyser.fftSize = store.getState().analyze.canvasOptions.fftSize; // 频谱分析的精度
	const audioSrc = audioContext.createMediaElementSource(audio); // 指定音频源
	audioSrc.connect(analyser); // 音频源连接到分析器
	analyser.connect(audioContext.destination); // 分析器连接到音频输出设备
};

/**
 * @description: 准备播放
 * @param id 歌曲的songId值
 */
export const playAudio = async (id) => {
	console.log('playAudio', id);
	// 让用户点击时才创建audioContext，否则会被浏览器策略限制
	if (!analyser) {
		createAnalyzer();
	}
	let { songId, songUrl, songList, volume, isEnded, currentTime, duration, isPause, playbackRate } =
		store.getState().audio;
	/* 1、用户点击指定一首新歌从0开始播放 */
	if (!!id && id !== songId) {
		console.log('指定新歌播放');
		songId = id;
		const song = songList.find((item) => item.songId === id);
		song && (songUrl = song.songUrl);
		PlayNewAudio({ songId, songUrl, volume, playbackRate });
		return;
	}
	/* 2、暂停后继续播放 */
	if (isPause && !!songUrl && !isEnded && duration) {
		console.log('暂停后播放');
		audio.currentTime = currentTime;
		try {
			audio.play().then(() => {
				dispatch(setIsPlaying(true));
				dispatch(setIsPause(false));
			});
		} catch (e) {
			console.log('e', e);
		}
		return;
	}
	/* 3、歌曲列表中没有任何歌曲信息，无法播放歌曲 */
	if (!songUrl && !songList?.length) {
		MessageToast.warning('暂无歌曲音频，请刷新页面后重试');
		return;
	}
	/* 4、有歌曲列表，但是没有待播放的歌曲信息 */
	if (!!songList?.length && !songUrl && !currentTime) {
		console.log('自动指定新歌播放');
		songUrl = songList[0].songUrl;
		songId = songList[0].songId;
	}
	PlayNewAudio({ songId, songUrl, volume, playbackRate });
};

/**
 * @description: 正式播放 (基于一首新的歌曲)
 * @param
 */
const PlayNewAudio = ({ songId, songUrl, volume, playbackRate }) => {
	console.log('readyPlayAudio');
	try {
		audio.volume = volume / 100; // 设置音量
		audio.src = songUrl;
		audio.playbackRate = playbackRate; // 切换歌曲时速率会重置为1
		audio
			.play()
			.then(() => {
				console.log('当前歌曲时长：', audio.duration);
				dispatch(setSongUrl(songUrl));
				dispatch(setSongId(songId));
				dispatch(setIsEnded(false));
				dispatch(setIsPlaying(true));
				dispatch(setIsPause(false));
				dispatch(setDuration(audio.duration));
			})
			.catch(() => {
				MessageToast.warning('歌曲播放失败');
			});
	} catch (error) {
		console.error('播放失败', error);
	}
};

/**
 * @description: 暂停歌曲
 */
export const pauseAudio = () => {
	console.log('pauseAudio');
	audio.pause();
	dispatch(setIsPlaying(false));
	dispatch(setIsPause(true));
};

/**
 * @description: 歌曲当前播放时间，实时保存
 */
audio.addEventListener('timeupdate', function () {
	// console.log('当前时间', audio.currentTime);
	dispatch(setCurrentTime(audio.currentTime));
});

/**
 * @description: 歌曲播放完毕
 *               songId不重置的目的是为了定位下一首歌曲
 */
audio.addEventListener('ended', function () {
	console.log('歌曲播放完毕');
	resetAudioStatus();
	// 	自动下一首
	playNextSong(false);
});

/**
 * @description: 歌曲结束时，重置状态
 */
const resetAudioStatus = () => {
	dispatch(setIsEnded(true));
	dispatch(setIsPlaying(false));
	dispatch(setIsPause(false));
	dispatch(setSongUrl(''));
	dispatch(setCurrentTime(0));
	dispatch(setDuration(0));
};

/**
 * @description: 调节音量
 * @param curVol 当前音量值
 */
export const changeVolume = (curVol) => {
	if (curVol <= 0) {
		dispatch(setVolume(0));
		dispatch(setIsMuted(true));
		audio.muted = true;
		return;
	}
	dispatch(setIsMuted(false));
	dispatch(setVolume(curVol)); // 保存最新音量
	audio.volume = curVol / 100; // 调节音量
	audio.muted = false;
};

/**
 * @description: 前进: 固定前进5s
 */
export const addCurrentTime = () => {
	const ADD_TIME = 5;
	const { duration, currentTime } = store.getState().audio;
	const lastTime = currentTime + ADD_TIME;
	// 歌曲直接结束，开始下一首
	if (lastTime >= duration) {
		resetAudioStatus();
		playNextSong(false);
		return;
	}
	audio.currentTime = lastTime;
};

/**
 * @description: 后退: 固定后退5s
 */
export const decreaseCurrentTime = () => {
	const DECREASE_TIME = -5;
	const { currentTime } = store.getState().audio;
	const lastTime = currentTime + DECREASE_TIME;
	// 歌曲从0开始播放
	if (lastTime <= 0) {
		audio.currentTime = 0;
		return;
	}
	audio.currentTime = lastTime;
};

/**
 * @description: 调节播放时间
 */
export const changeCurrentTime = (curTime) => {
	audio.currentTime = curTime;
};

/**
 * @description: 调节音乐播放模式: 1-顺序播放、2-随机播放、3-单曲循环
 */
export const changeMusicMode = (mode) => {
	dispatch(setMusicMode(mode));
};

/**
 * @description: 改变音频的播放速率
 */
export const changePlaybackRate = (playbackRate) => {
	audio.playbackRate = playbackRate;
	dispatch(setPlaybackRate(playbackRate));
};

/**
 * @description: 从播放列表删除删除歌曲
 */
export const deleteSongFromSongList = async (songId) => {
	const { songList, isPlaying } = store.getState().audio;
	const index = songList.findIndex((item) => item.songId === songId);
	if (index === -1) {
		console.error('删除的歌曲index不存在：', index);
		return;
	}
	// 只有一首歌时，不允许删除
	if (songList.length === 1) {
		MessageToast.warning('别删啦！播放列表仅剩一首歌！');
		return;
	}
	// 找到下一首歌
	const targetSong = songList[index === songList?.length - 1 ? 0 : index + 1];
	if (!targetSong) {
		console.error('targetSong不存在:', targetSong);
		return;
	}
	dispatch(deleteSongById(index)); // 删除
	dispatch(setSongId(targetSong.songId));
	if (isPlaying) {
		audio.pause();
		await playAudio(targetSong.songId); // 播放下一首
	}
};
