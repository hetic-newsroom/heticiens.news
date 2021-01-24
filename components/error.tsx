import Link from 'next/link'
import styles from './error.module.scss'

const errors = {
	404: 'Cette page n’a pas été trouvée.',
	403: 'Vous n’avez pas accès à cette page.',
	500: 'Tout est cassé. On va s’en occuper!'
}

export interface ErrorProps {
	code: number
}

export default function Error(props: ErrorProps) {
	return <section className={styles.error}>
		<h1>{props.code}</h1>
		<p>{errors[props.code] || 'Erreur inconnue.'}</p>
		<Link href="/">
			<a><span>Retour à la page d'accueil</span></a>
		</Link>
		<style jsx>{`
			h1 {
				--error-code: "${props.code}";
			}
		`}</style>
	</section>
}
