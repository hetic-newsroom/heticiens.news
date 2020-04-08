import Icon from './icon';

export default () => (
	<header>
		<div className="email-icon mobile">
			<Icon name="email" width="100%" height="100%"/>
		</div>
		<h2 className="mobile">H|N</h2>
		<div className="mobile layout-placeholder"/>

		<h2 className="desktop">HETIC Newsroom</h2>

		<style jsx>{`
			header {
				position: fixed;
				top: 0;
				left: 0;
				z-index: 100;
				width: 100%;
				height: 54px;
				display: flex;
				align-items: center;
				background: var(--color-background);
			}

			h2 {
				line-height: 1;
			}

			@media (max-width: 659px) {
				header {
					justify-content: space-between;
					padding: 0 15px;
				}

				.email-icon {
					cursor: pointer;
					width: ${30 / 16}rem;
					height: ${30 / 16}rem;
				}

				.layout-placeholder {
					width: ${30 / 16}rem;
				}

				.desktop {
					display: none;
				}
			}

			@media (min-width: 660px) {
				header {
					left: 15px;
					width: calc(100% - 30px);
					max-width: 1100px;
					height: calc(54px + 5vmin);
					align-items: flex-end;
					justify-content: start;
					padding-bottom: 10px;
					border-bottom: 1px solid var(--color-dark-grey);
				}

				.mobile {
					display: none;
				}
			}

			@media (min-width: 1100px) {
				header {
					left: calc(50% - ${1100 / 2}px);
				}
			}
		`}
		</style>
	</header>
);
