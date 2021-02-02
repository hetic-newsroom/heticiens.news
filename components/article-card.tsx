import type Article from 'types/article'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import styles from './article-card.module.scss'

export default function ArticleCard({ article: props }: { article: Article }) {
	const dateString = useMemo(() => {
		const date = new Date(props.date)
		const day = date.getDate()
		const month = (m => {
			if (m.toString().length < 2) {
				return '0'+m
			}
			return m
		})(date.getMonth() + 1)
		const year = date.getFullYear()

		return [day, month, year].join('/')
	}, [props.date])

	return <div className={styles.card}>
		<motion.div layoutId={`articlePoster-${props.uid}`} className={styles.imageContainer}>
			<Link href={`/article/${props.uid}`}><a>
				<Image
					src={props.poster.src}
					alt={props.poster.alt}
					layout="fill"
					objectFit="cover"
				/>
			</a></Link>
		</motion.div>
		<div className={styles.articleInfo}>
			<Link href={`/category/${props.category.uid}`}><a>
				<motion.span layoutId={`articleCategory-${props.uid}`}>
					{ props.category.name.replace(/s$/, '') }
				</motion.span>
			</a></Link>
			<Link href={`/article/${props.uid}`}><a>
				<motion.h3 layoutId={`articleTitle-${props.uid}`}>
					{ props.title }
				</motion.h3>
			</a></Link>
			<Link href={`/article/${props.uid}`}><a>
				<p className={styles.intro}>
					{ props.intro }
				</p>
			</a></Link>
			<span className={styles.details}>
				{ props.authors[0].name } — { dateString }
			</span>
		</div>
	</div>
}
