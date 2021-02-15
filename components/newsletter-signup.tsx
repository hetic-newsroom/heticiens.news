import styles from './newsletter-signup.module.scss'

export default function NewsletterSignupCard() {
	return <div className={styles.container}>
		<h2>La Newsroom dans votre inbox.</h2>
		<span className={styles.subtitle}>
			Inscrivez-vous à la newsletter pour être informé des dernières publications.
		</span>
		<form
			className={styles.form}
			method="post"
			action="https://news.us7.list-manage.com/subscribe/post?u=2f083859e395c6db4db1899e4&amp;id=f0ac8baaa5"
			target="_blank"
			noValidate
		>
			<input className={styles.input} type="email" defaultValue="" name="EMAIL" placeholder="mail@example.com"/>
			<input className={styles.input} type="submit" value="S’inscrire" name="subscribe"/>
			{/* Real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
			<div style={{ position: 'absolute', left: -5000 }} aria-hidden="true">
				<input type="text" name="b_2f083859e395c6db4db1899e4_f0ac8baaa5" tabIndex={-1} defaultValue=""/>
			</div>
		</form>
	</div>
}
