import type { PropsWithChildren } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import classNames from 'classnames/bind'
import styles from './columns.module.scss'

const cx = classNames.bind(styles)

type Spacing = 'x-small' | 'small' | 'medium' | 'large'
export interface ColumnsProps {
	no: '4'  | '3' | '23' | '2' | '1'
	gap?: Spacing
	rowGap?: Spacing
	columnGap?: Spacing
	revealAnimation?: boolean
}

export default function Columns({ no, children, gap, rowGap, columnGap, revealAnimation }: PropsWithChildren<ColumnsProps>) {
	if (typeof gap === 'string') {
		rowGap = gap
		columnGap = gap
	}

	const cns = cx({
		columns4: (no === '4'),
		columns3: (no === '3'),
		columns23: (no === '23'),
		columns2: (no === '2'),
		column1: (no === '1'),
		rowGap: (typeof rowGap === 'string'),
		columnGap: (typeof columnGap === 'string'),
		[(rowGap) ? `row-${rowGap}`: '']: (typeof rowGap === 'string'),
		[(columnGap) ? `column-${columnGap}`: '']: (typeof columnGap === 'string')
	})

	if (revealAnimation) {
		return <motion.div
			className={cns}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				staggerChildren: 0.2
			}}
		>
			<AnimatePresence>
				{children && Array.isArray(children) && children.map((child, i) =>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						key={i}
					>
						{ child }
					</motion.div>
				)}
				{children && !Array.isArray(children) &&
					<>{ children }</>
				}
			</AnimatePresence>
		</motion.div>
	}

	return <div className={cns}>
		{ children }
	</div>
}
