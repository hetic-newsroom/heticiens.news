import * as React from 'react';
import Link from 'next/link';
import NavMenu from './navmenu';
import Newsletter from './newsletter-subscribe';
import Icon from './icon';

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			newsletterOpened: false
		};

		this.handleNewsletterClick = this.handleNewsletterClick.bind(this);
		this.handleNewsletterQuit = this.handleNewsletterQuit.bind(this);
	}

	handleNewsletterClick() {
		this.setState({
			newsletterOpened: true
		});
	}

	handleNewsletterQuit() {
		this.setState({
			newsletterOpened: false
		});
	}

	render() {
		return (
			<header>
				<div className="email-icon mobile">
					<Icon name="email" width="100%" height="100%" onClick={this.handleNewsletterClick}/>
					<Newsletter opened={this.state.newsletterOpened} onWantClose={this.handleNewsletterQuit}/>
				</div>
				<Link href="/">
					<a className="mobile">
						<div className="mobile icon">
							<Icon name="hn" height="100%" width="100%"/>
						</div>
					</a>
				</Link>

				<Link href="/">
					<a className="desktop"><h2 className="desktop">HETIC Newsroom</h2></a>
				</Link>

				<div className="navmenu-wrapper">
					<NavMenu/>
				</div>

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
						cursor: pointer;
					}

					.mobile.icon {
						height: ${30 / 16}rem;
						width: calc(${30 / 16}rem * 1.6);
					}

					@media (max-width: 659px) {
						header {
							justify-content: space-between;
							padding: 0 15px;
						}

						.email-icon, .navmenu-wrapper {
							cursor: pointer;
							width: ${30 / 16}rem;
							height: ${30 / 16}rem;
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
							justify-content: space-between;
							padding-bottom: 10px;
							border-bottom: 1px solid var(--color-dark-grey);
						}

						header::before {
							content: "";
							display: block;
							z-index: -1;
							position: fixed;
							top: 0;
							left: 0;
							right: 0;
							height: calc(53px + 5vmin);
							background: var(--color-background);
						}


						.navmenu-wrapper {
							cursor: pointer;
							width: ${30 / 16}rem;
							height: ${30 / 16}rem;
						}

						.mobile {
							display: none;
						}
					}

					@media (min-width: 900px) {
						.navmenu-wrapper {
							width: auto;
						}
					}

					@media (min-width: 1100px) {
						header {
							left: calc(50% - ${1100 / 2}px);
						}			}
				`}
				</style>
			</header>
		);
	}
}
