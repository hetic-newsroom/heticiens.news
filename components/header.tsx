import { useState } from 'react'
import { useToggle, useIsomorphicLayoutEffect } from 'react-use'
import Link from 'next/link'
import { Menu, X } from 'react-feather'
import { motion } from 'framer-motion'
import classNames from 'classnames/bind'
import styles from './header.module.scss'

const cx = classNames.bind(styles)

type Uid = string
export interface HeaderProps {
	categories: [string, Uid][]
	route: string
}
export default function Header(props: HeaderProps) {
	const [menuOpen, toggleMenu] = useToggle(false)
	const [headerHeight, setHeaderHeight] = useState(0)

	useIsomorphicLayoutEffect(() => {
		const headerElement = document.getElementById('main-header')
		if (!headerElement) return
		const observer = new window.ResizeObserver(entries => {
			// Chrome uses non-standard nested array, and our type library is being a bitch by only recognizing that non-standard spec
			/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
			// @ts-ignore
			const height = entries[0].borderBoxSize.blockSize || entries[0].borderBoxSize[0].blockSize
			setHeaderHeight(height)
		})
		observer.observe(headerElement)

		return () => {
			observer.disconnect()
		}
	})

	return <motion.header
		id="main-header"
		className={cx({
			header: true,
			menuOpened: menuOpen
		})}
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
	>
		<div className={styles.barContainer}>
			<motion.button
				className={styles.menuToggle}
				onClick={toggleMenu}
				initial={{
					opacity: 0,
					translateY: (menuOpen) ? '-100%' : '100%'
				}}
				animate={{
					opacity: 1,
					translateY: '0%'
				}}
				key={`menu-toggle-${menuOpen}`}
			>
				{ (menuOpen) ? <X/> : <Menu/> }
			</motion.button>
			<Link href="/"><a>
				<h1>HETIC Newsroom</h1>
			</a></Link>
			<p>{ props.route }</p>
		</div>

		<motion.section
			className={styles.menu}
			variants={{
				hidden: {
					height: '0vh',
					transition: {
						ease: 'anticipate',
						duration: 0.3
					}
				},
				opened: {
					height: `calc(100vh - ${headerHeight}px)`,
					transition: {
						ease: 'anticipate',
						staggerChildren: 0.15,
						staggerDirection: 1
					}
				}
			}}
			initial="hidden"
			animate={(menuOpen) ? 'opened' : 'hidden'}
		>
			<nav>
				<ul>
					{props.categories.map(e => (
						<motion.li
							variants={{
								hidden: { opacity: 0 },
								opened: { opacity: 1 }
							}}
							key={e[1]}
						>
							<span>
								<Link href={(e[1]) ? `/category/${e[1]}` : '#'}>
									<a>{e[0]}</a>
								</Link>
							</span>
						</motion.li>
					))}
				</ul>
				<div style={{ background: 'red' }}></div>
			</nav>
		</motion.section>
	</motion.header>
}
