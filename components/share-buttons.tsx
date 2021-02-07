import { motion } from 'framer-motion'
import { Share, Twitter, Facebook, Linkedin, Mail } from 'react-feather'
import styles from './share-buttons.module.scss'

export default function ShareButtons({ link, revealAnimation }: { link: string; revealAnimation?: boolean }) {
	let animationProps = {}
	if (revealAnimation) {
		animationProps = {
			variants: {
				hidden: {
					opacity: 0
				},
				show: {
					opacity: 1,
					transition: {
						delay: 0.7,
						staggerChildren: 0.2
					}
				}
			}
		}
	}

	const linkProps = {
		target: '_blank',
		rel: 'noopener',
		...animationProps
	}

	return <motion.div
		className={styles.share}
		initial="hidden"
		animate="show"
		{...animationProps}
	>
		{(typeof navigator !== 'undefined' && navigator.share) &&
			<motion.a
				href="#"
				onClick={e => {
					e.preventDefault()
					navigator.share({
						url: link
					})
				}}
				{ ...animationProps }
			>
				<Share/>
			</motion.a>
		}
		<motion.a
			href={`https://twitter.com/share?text=${link}%20via%20@hetic_newsroom`}
			{ ...linkProps }
		>
			<Twitter/>
		</motion.a>
		<motion.a
			href={`https://www.facebook.com/sharer/sharer.php?u=${link}`}
			{ ...linkProps }
		>
			<Facebook/>
		</motion.a>
		<motion.a
			href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`}
			{ ...linkProps }
		>
			<Linkedin/>
		</motion.a>
		<motion.a
			href={`mailto:?body=${link}`}
			{ ...linkProps }
		>
			<Mail/>
		</motion.a>
	</motion.div>
}
