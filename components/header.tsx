import { useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useToggle } from 'react-use'
import Link from 'next/link'
import { Menu, X, Headphones, Video, User, Twitter, Instagram, Linkedin, Youtube } from 'react-feather'
import { motion } from 'framer-motion'
import type Category from 'types/category'
import SearchInput from './search-input'
import NewsletterSignupCard from './newsletter-signup'
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

	useEffect(() => {
		document.body.style.overflow = (menuOpen) ? 'hidden' : 'auto'
	}, [menuOpen])

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

	function performSearch(search: string) {
		if (!menuOpen || search.length < 2) return
		router.push(`/search?q=${encodeURIComponent(search).replace(/%20/g, '+')}`)
	}

	const opacityVariants = {
		hidden: { opacity: 0 },
		opened: { opacity: 1 }
	}

	const staggerChildren = {
		staggerChildren: 0.1,
		staggerDirection: 1
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
					overflow: 'hidden',
					transition: {
						ease: 'anticipate',
						duration: 0.3
					}
				},
				opened: {
					height: `calc(100vh - ${headerRef.current?.getBoundingClientRect().bottom}px)`,
					overflow: 'auto',
					transition: {
						ease: 'anticipate'
					}
				}
			}}
			initial="hidden"
			animate={(menuOpen) ? 'opened' : 'hidden'}
		>
			<div className={styles.menuColumnsWrapper}>
				<motion.div className={styles.searchColumn} variants={opacityVariants} transition={staggerChildren}>
					<div className={styles.searchContainer}>
						<motion.h2 variants={opacityVariants}>
							Rechercher
						</motion.h2>
						<motion.div variants={opacityVariants} className={styles.searchBoxContainer}>
							<SearchInput onThrottledChange={performSearch}/>
						</motion.div>
					</div>

					<motion.nav variants={opacityVariants} transition={staggerChildren}>
						<motion.h2 variants={opacityVariants}>
							Catégories
						</motion.h2>
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
					</motion.nav>

					<motion.nav variants={opacityVariants} transition={staggerChildren}>
						<motion.h2 variants={opacityVariants}>
							Découvrir
						</motion.h2>
						<ul>
							<motion.li variants={opacityVariants} className={styles.iconedLinks}>
								<span>
									<Link href="/category/hnyou">
										<a>
											<Headphones size="28px"/>
											HN'You
										</a>
									</Link>
								</span>
							</motion.li>
							<motion.li variants={opacityVariants} className={styles.iconedLinks}>
								<span>
									<Link href="/category/videos">
										<a>
											<Video size="28px"/>
											Vidéos
										</a>
									</Link>
								</span>
							</motion.li>
							<motion.li variants={opacityVariants} className={styles.iconedLinks}>
								<span>
									<Link href="/about">
										<a>
											<User size="28px"/>
											Qui sommes-nous ?
										</a>
									</Link>
								</span>
							</motion.li>
						</ul>
					</motion.nav>
				</motion.div>

				<motion.nav variants={opacityVariants} transition={staggerChildren}>
					<motion.h2 variants={opacityVariants}>
						Nous suivre
					</motion.h2>
					<ul className={styles.socialLinksContainer}>
						<motion.li variants={opacityVariants}>
							<a href="https://twitter.com/hetic_newsroom" target="_blank" rel="noopener">
								<Twitter size="32px"/>
							</a>
						</motion.li>
						<motion.li variants={opacityVariants}>
							<a href="https://www.youtube.com/channel/UCUdr_JzbdkV6bVvOTSpseEA" target="_blank" rel="noopener">
								<Youtube size="32px"/>
							</a>
						</motion.li>
						<motion.li variants={opacityVariants}>
							<a href="https://www.linkedin.com/company/hetic-newsroom" target="_blank" rel="noopener">
								<Linkedin size="32px"/>
							</a>
						</motion.li>
						<motion.li variants={opacityVariants}>
							<a href="https://www.instagram.com/hetic_newsroom" target="_blank" rel="noopener">
								<Instagram size="32px"/>
							</a>
						</motion.li>
					</ul>
				</motion.nav>

				<motion.div className={styles.newsColumn} variants={opacityVariants} transition={staggerChildren}>
					<NewsletterSignupCard/>
				</motion.div>
			</div>
		</motion.section>
	</motion.header>
}
