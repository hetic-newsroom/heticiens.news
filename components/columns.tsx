import { ReactNode } from 'react'
import classNames from 'classnames/bind'
import styles from './columns.module.scss'

const cx = classNames.bind(styles)

export interface ColumnsProps {
	no: '4'  | '3' | '2_3' | '2' | '1'
	children: ReactNode
}

export default function Columns({ no, children }: ColumnsProps) {
	return <div
		className={cx({
			columns4: (no === '4'),
			columns3: (no === '3'),
			columns2_3: (no === '2_3'),
			columns2: (no === '2'),
			column1: (no === '1')
		})}
	>
		{ children }
	</div>
}
