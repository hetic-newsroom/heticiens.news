import type Article from 'types/article'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import styles from './article-full-view.module.scss'

export default function ArticleFullView({ article: props }: { article: Article }) {
	return <article
		className={styles.articleContainer}
	>
		<div className={styles.head}>
			<header className={styles.titleSection}>
				<span className={styles.category}>
					<Link href={`/category/${props.category.uid}`}>
						<a>{ props.category.name.replace(/s$/, '') }</a>
					</Link>
				</span>
				<motion.h1 layoutId={`articleTitle-${props.uid}`} className={styles.title}>
					{ props.title }
				</motion.h1>
				<div className={styles.authorPreviewsContainer}>
					{props.authors.map(author => (
						<Link href={`/author/${author.uid}`} key={author.uid}><a>
							<div className={styles.authorPreview}>
								<div className={styles.authorImgContainer}>
									<Image
										src={author.picture.src}
										alt={author.name}
										width="35px"
										height="35px"
										layout="fixed"
									/>
								</div>
								<span className={styles.authorName}>{ author.name }</span>
							</div>
						</a></Link>
					))}
				</div>
				<motion.p
					className={styles.intro}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6 }}
				>
					{ props.intro }
				</motion.p>
			</header>
			<aside className={styles.posterContainer}>
				<Image
					src={props.poster.src}
					alt={props.poster.alt}
					layout="fill"
					objectFit="cover"
					objectPosition="center top"
					sizes="(max-width: 1400px) 100vw, 1400px"
					priority
				/>
			</aside>
		</div>
		<div className={styles.mainTextContainer}>
		</div>
	</article>
}


// <RichText render={pageProps.rawcat.content} htmlSerializer={htmlSerializer}/>
