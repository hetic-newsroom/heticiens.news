import classNames from 'classnames/bind'
import styles from './spacer.module.scss'

const cx = classNames.bind(styles)

type Spacing = 'x-small' | 'small' | 'medium' | 'large'
export interface SpacerProps {
	width?: Spacing
	height?: Spacing
}

interface SpacerWithWidth extends SpacerProps {
	width: Spacing
}

interface SpacerWithHeight extends SpacerProps {
	height: Spacing
}

export default function Spacer({ width, height }: SpacerWithWidth | SpacerWithHeight) {
	return <div
		className={cx({
			[(width) ? `width-${width}`: '']: (typeof width === 'string'),
			[(height) ? `height-${height}`: '']: (typeof height === 'string')
		})}
	/>
}
