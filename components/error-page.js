import Link from 'next/link';
import Page from './page';
import Button from './button';

const errors = {
	404: 'Cette page n’a pas été trouvée.',
	403: 'Vous n’avez pas accès à cette addresse.',
	500: 'Tout est cassé. On va s’en occuper!'
};

export default props => (
	<Page>
		<h1>{props.code}</h1>
		<h3>{errors[props.code]}</h3>
		<Link href="/">
			<Button primary value="Retour à l’accueil"/>
		</Link>
		<style jsx global>{`
			#pageWidthContainer {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
		`}
		</style>
		<style jsx>{`
			h1 {
				display: block;
				position: relative;
				font-size: 25vmin;
				text-align: center;
			}

			h3 {
				font-weight: 500;
				margin: 15px 0 30px;
			}

			@keyframes noise-anim {
				0% {
					clip-path: inset(35% 0 45% 0);
				}
				5% {
					clip-path: inset(6% 0 43% 0);
				}
				10% {
					clip-path: inset(69% 0 27% 0);
				}
				15% {
					clip-path: inset(46% 0 35% 0);
				}
				20% {
					clip-path: inset(33% 0 17% 0);
				}
				25% {
					clip-path: inset(47% 0 53% 0);
				}
				30% {
					clip-path: inset(100% 0 1% 0);
				}
				35% {
					clip-path: inset(42% 0 16% 0);
				}
				40% {
					clip-path: inset(63% 0 23% 0);
				}
				45% {
					clip-path: inset(43% 0 54% 0);
				}
				50% {
					clip-path: inset(96% 0 2% 0);
				}
				55% {
					clip-path: inset(50% 0 49% 0);
				}
				60% {
					clip-path: inset(9% 0 26% 0);
				}
				65% {
					clip-path: inset(85% 0 5% 0);
				}
				70% {
					clip-path: inset(72% 0 9% 0);
				}
				75% {
					clip-path: inset(67% 0 5% 0);
				}
				80% {
					clip-path: inset(58% 0 6% 0);
				}
				85% {
					clip-path: inset(3% 0 1% 0);
				}
				90% {
					clip-path: inset(43% 0 20% 0);
				}
				95% {
					clip-path: inset(99% 0 1% 0);
				}
				100% {
					clip-path: inset(59% 0 25% 0);
				}
			}
			h1::after {
				content: "${props.code}";
				position: absolute;
				left: 2px;
				text-shadow: -1px 0 red;
				top: 0;
				color: var(--color-black);
				background: var(--color-white);
				overflow: hidden;
				animation: noise-anim 2s infinite linear alternate-reverse;
			}

			@keyframes noise-anim-2 {
				0% {
					clip-path: inset(47% 0 45% 0);
				}
				5% {
					clip-path: inset(92% 0 5% 0);
				}
				10% {
					clip-path: inset(54% 0 9% 0);
				}
				15% {
					clip-path: inset(62% 0 25% 0);
				}
				20% {
					clip-path: inset(74% 0 18% 0);
				}
				25% {
					clip-path: inset(46% 0 41% 0);
				}
				30% {
					clip-path: inset(86% 0 14% 0);
				}
				35% {
					clip-path: inset(48% 0 44% 0);
				}
				40% {
					clip-path: inset(1% 0 75% 0);
				}
				45% {
					clip-path: inset(56% 0 7% 0);
				}
				50% {
					clip-path: inset(69% 0 23% 0);
				}
				55% {
					clip-path: inset(28% 0 65% 0);
				}
				60% {
					clip-path: inset(88% 0 6% 0);
				}
				65% {
					clip-path: inset(36% 0 1% 0);
				}
				70% {
					clip-path: inset(40% 0 30% 0);
				}
				75% {
					clip-path: inset(93% 0 2% 0);
				}
				80% {
					clip-path: inset(12% 0 40% 0);
				}
				85% {
					clip-path: inset(17% 0 44% 0);
				}
				90% {
					clip-path: inset(61% 0 39% 0);
				}
				95% {
					clip-path: inset(59% 0 20% 0);
				}
				100% {
					clip-path: inset(90% 0 5% 0);
				}
			}
			h1::before {
				content: "${props.code}";
				position: absolute;
				left: -2px;
				text-shadow: 1px 0 blue;
				top: 0;
				color: var(--color-black);
				background: var(--color-white);
				overflow: hidden;
				transform: rotate(180deg);
				animation: noise-anim-2 15s infinite linear alternate-reverse;
			}
		`}
		</style>
	</Page>
);
