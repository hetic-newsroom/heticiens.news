import type { ReactElement } from 'react'
import Author, { SocialWebsite } from 'types/author'
import Image from 'next/image'
import { Twitter, Facebook, Instagram, Linkedin, Link } from 'react-feather'
import { motion } from 'framer-motion'
import styles from './author-full-view.module.scss'

export default function AuthorFullView({ author }: { author: Author }) {
	return <motion.div
		className={styles.container}
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
	>
		<div className={styles.photoContainer}>
			<Image
				src={author.picture.src}
				alt={author.name}
				width="80px"
				height="80px"
				layout="fixed"
			/>
		</div>
		<h1>{ author.name }</h1>
		<p>{ author.bio }</p>
		<ul className={styles.socialContainer}>
			{author.social && Object.keys(author.social).map(site => {
				const link = author.social && author.social[site as SocialWebsite]
				let icon: ReactElement
				switch(site) {
					case 'facebook':
						icon = <Facebook/>
						break
					case 'instagram':
						icon = <Instagram/>
						break
					case 'twitter':
						icon = <Twitter/>
						break
					case 'linkedin':
						icon = <Linkedin/>
						break
					default:
						icon = <Link/>
				}
				return <li
					key={site}
				>
					<a href={link} target="_blank" rel="noopener">
						{ icon }
					</a>
				</li>
			})}
		</ul>
	</motion.div>
}
