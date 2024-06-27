import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { ProjectImagesStyles } from '@/views/projectSection/css/ProjectImagesStyles';

/**
 * @description: 项目展示的轮播图
 */
const ProjectImages = ({ projectName }) => {
	return (
		<ProjectImagesStyles>
			{projectName && <img className='img' src={require(`@/assets/image/project/${projectName}-1.png`)} alt='' />}
		</ProjectImagesStyles>
	);
};

ProjectImages.propTypes = {
	projectName: PropTypes.string,
	startPlayAnimation: PropTypes.bool
};

export default memo(ProjectImages);
