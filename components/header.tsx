import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useToggle, useLockBodyScroll } from 'react-use'
import Link from 'next/link'
import { Menu, X } from 'react-feather'
import { motion } from 'framer-motion'
import classNames from 'classnames/bind'
import type Category from 'types/category'
import styles from './header.module.scss'

const cx = classNames.bind(styles)

export interface HeaderProps {
	categories: Category[]
}
export default function Header(props: HeaderProps) {
	const [menuOpen, toggleMenu] = useToggle(false)
	const headerRef = useRef<HTMLElement>(null)
	const router = useRouter()

	useLockBodyScroll(menuOpen)

	useEffect(() => {
		const handleRouteChange = () => {
			if (menuOpen) toggleMenu()
			// Fix for links staying :focused through router navigation in _app-mounted components
			;(document.activeElement as HTMLElement)?.blur()
		}

		router.events.on('routeChangeStart', handleRouteChange)

		return () => {
			router.events.off('routeChangeStart', handleRouteChange)
		}
	})

	return <motion.header
		ref={headerRef}
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
			<p>{ router.asPath }</p>
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
					height: `calc(100vh - ${headerRef.current?.getBoundingClientRect().bottom}px)`,
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
					{props.categories.map(c => (
						<motion.li
							variants={{
								hidden: { opacity: 0 },
								opened: { opacity: 1 }
							}}
							key={c.uid}
						>
							<span>
								<Link href={`/category/${c.uid}`}>
									<a>{c.name}</a>
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
