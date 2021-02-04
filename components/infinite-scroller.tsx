import type { ReactElement } from 'react'
import { useState, useRef, useEffect } from 'react'
import { useIntersection } from 'react-use'
import { motion } from 'framer-motion'

export interface InfiniteScrollerProps {
	initial: ReactElement[]
	getMore: (page: number) => Promise<ReactElement[]>
	forwardRevealAnimation?: boolean
}

export default function InfiniteScroller(props: InfiniteScrollerProps) {
	const [items, setItems] = useState(props.initial)
	const [loading, setLoading] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)

	const triggerRef = useRef<HTMLDivElement>(null)
	const intersection = useIntersection(triggerRef, {
		root: null,
		threshold: 1
	})

	useEffect(() => {
		if (intersection?.isIntersecting && !loading) {
			setLoading(true)

			props.getMore(currentPage + 1).then(newItems => {
				setCurrentPage(currentPage + 1)
				setItems([...items, ...newItems])
			}).catch(e => { throw e }).finally(() => {
				setLoading(false)
			})
		}
	}, [intersection])

	if (props.forwardRevealAnimation) {
		const variants = {
			hidden: { opacity: 0 },
			show: { opacity: 1 }
		}

		return <>
			{items && items.map((child, i) =>
				<motion.div
					variants={variants}
					key={i}
				>
					{ child }
				</motion.div>
			)}
			<div ref={triggerRef}></div>
		</>
	}

	return <>
		{ items }
		<div ref={triggerRef}></div>
	</>
}
