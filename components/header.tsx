import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useToggle, useLockBodyScroll } from 'react-use'
import Link from 'next/link'
import { Menu, X, Headphones, Twitter, Instagram, Linkedin, Youtube } from 'react-feather'
import { motion } from 'framer-motion'
import type Category from 'types/category'
import classNames from 'classnames/bind'
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

	const opacityVariants = {
		hidden: { opacity: 0 },
		opened: { opacity: 1 }
	}

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
				{router.asPath === '/' &&
					<h1>HETIC Newsroom</h1>
				}
				{router.asPath !== '/' &&
					<h2>HETIC Newsroom</h2>
				}
			</a></Link>
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
						staggerChildren: 0.1,
						staggerDirection: 1
					}
				}
			}}
			initial="hidden"
			animate={(menuOpen) ? 'opened' : 'hidden'}
		>
			<div className={styles.menuColumnsWrapper}>
				<nav>
					<motion.h2 variants={opacityVariants}>Catégories</motion.h2>
					<ul>
						{props.categories.map(c => (
							<motion.li
								variants={opacityVariants}
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
				</nav>
				<nav>
					<motion.h2 variants={opacityVariants}>En savoir plus</motion.h2>
					<ul>
						<motion.li variants={opacityVariants}>
							<span>
								<Link href="/">
									<a>hello</a>
								</Link>
							</span>
						</motion.li>
					</ul>
				</nav>
				<nav>
					<motion.h2 variants={opacityVariants}>Et aussi...</motion.h2>
					<ul className={styles.socialCardsContainer}>
						<motion.li variants={opacityVariants}>
							<a href="https://anchor.fm/hetic-newsroom" target="_blank" rel="noopener">
								<div
									className={styles.socialCard}
									data-site="podcast"
								>
									<Headphones size="32px"/>
									<span>HN'You</span>
								</div>
							</a>
						</motion.li>
						<motion.li variants={opacityVariants}>
							<a href="https://twitter.com/hetic_newsroom" target="_blank" rel="noopener">
								<div
									className={styles.socialCard}
									data-site="twitter"
								>
									<Twitter size="32px"/>
								</div>
							</a>
						</motion.li>
						<motion.li variants={opacityVariants}>
							<a href="https://www.youtube.com/channel/UCUdr_JzbdkV6bVvOTSpseEA" target="_blank" rel="noopener">
								<div
									className={styles.socialCard}
									data-site="youtube"
								>
									<Youtube size="32px"/>
								</div>
							</a>
						</motion.li>
						<motion.li variants={opacityVariants}>
							<a href="https://www.linkedin.com/company/hetic-newsroom" target="_blank" rel="noopener">
								<div
									className={styles.socialCard}
									data-site="linkedin"
								>
									<Linkedin size="32px"/>
								</div>
							</a>
						</motion.li>
						<motion.li variants={opacityVariants}>
							<a href="https://www.linkedin.com/company/hetic-newsroom" target="_blank" rel="noopener">
								<div
									className={styles.socialCard}
									data-site="instagram"
								>
									<Instagram size="32px"/>
								</div>
							</a>
						</motion.li>
					</ul>
				</nav>
			</div>
		</motion.section>
	</motion.header>
}
