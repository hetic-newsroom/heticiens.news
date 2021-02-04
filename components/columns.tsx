import type { ReactElement } from 'react'
import { motion } from 'framer-motion'
import classNames from 'classnames/bind'
import styles from './columns.module.scss'

const cx = classNames.bind(styles)

export interface ColumnsProps {
	no: '4'  | '3' | '23' | '2' | '1'
	children: ReactElement[]
	revealAnimation?: boolean
}

export default function Columns({ no, children, revealAnimation }: ColumnsProps) {
	const cns = cx({
		columns4: (no === '4'),
		columns3: (no === '3'),
		columns23: (no === '23'),
		columns2: (no === '2'),
		column1: (no === '1')
	})

	if (revealAnimation) {
		const variants = {
			hidden: { opacity: 0 },
			show: {
				opacity: 1,
				transition: {
					staggerChildren: 0.2
				}
			}
		}

		return <motion.div
			className={cns}
			variants={variants}
			initial="hidden"
			animate="show"
		>
			{children.map(child => 
				<motion.div
					variants={variants}
				>
					{ child }
				</motion.div>
			)}
		</motion.div>
	} else {
		return <div className={cns}>
			{ children }
		</div>
	}
}
