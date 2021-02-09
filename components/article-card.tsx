import type Article from 'types/article'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import shortenText from 'lib/text-shortener'
import classNames from 'classnames/bind'
import styles from './article-card.module.scss'

const cx = classNames.bind(styles)

export interface ArticleCardProps {
	article: Article
	size?: 'large' | 'medium' | 'small'
}

export default function ArticleCard({ article: props, size }: ArticleCardProps) {
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

	return <div
		className={cx({
			card: true,
			largeCard: (size === 'large'),
			smallCard: (size === 'small')
		})}
	>
		<motion.div layoutId={`articlePoster-${props.uid}`} className={styles.imageContainer}>
			<Link href={`/article/${props.uid}`}><a>
				<Image
					src={props.poster.src}
					alt={props.poster.alt}
					layout="fill"
					objectFit="cover"
					priority={(size === 'large')}
				/>
			</a></Link>
		</motion.div>
		<div className={styles.articleInfo}>
			{(size === 'large') &&
				<h2>À la Une</h2>
			}
			<Link href={`/category/${props.category.uid}`}><a>
				<motion.span layoutId={`articleCategory-${props.uid}`} className={styles.category}>
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
					{ shortenText(props.intro) }
				</p>
			</a></Link>
			<span className={styles.details}>
				{ props.authors[0].name } — { dateString }
			</span>
		</div>
	</div>
}
