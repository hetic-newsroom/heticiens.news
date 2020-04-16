import * as React from 'react';
import Link from 'next/link';
import Router from 'next/router';
import classNames from 'classnames';
import DefaultColorScheme from '../lib/colors-default';
import Icon from './icon';
import Button from './button';
// Disabled: import Input from './input';
import Newsletter from './newsletter-subscribe';

export default class NavMenu extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opened: false,
			desktop: false,
			url: '/',
			newsletterOpened: false
		};

		this.openOrClose = this.openOrClose.bind(this);
		this.onWindowResize = this.onWindowResize.bind(this);
		this.newsletterOpen = this.newsletterOpen.bind(this);
		this.newsletterWantClose = this.newsletterWantClose.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.onWindowResize);
		this.onWindowResize();
		this.setState({
			url: Router.router.asPath
		});
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.onWindowResize);
	}

	openOrClose() {
		this.setState(state => ({opened: !state.opened}));
	}

	onWindowResize() {
		if (window.innerWidth > 900) {
			this.setState({
				desktop: true
			});
		} else if (this.state.desktop) {
			this.setState({
				desktop: false
			});
		}
	}

	newsletterOpen() {
		this.setState({
			opened: false,
			newsletterOpened: true
		});
	}

	newsletterWantClose() {
		this.setState({
			newsletterOpened: false
		});
	}

	render() {
		if (this.state.desktop) {
			return (
				<nav>
					<ul>
						<li className={classNames({active: (this.state.url === '/')})}>
							<Link href="/">
								<a><span>À la une</span></a>
							</Link>
						</li>
						<li className="dropdown">
							<span>Catégories</span>
							<ul>
								<li className={classNames({active: (this.state.url === '/category/interviews')})}>
									<Link href="/category/interviews">
										<a><span>Interviews</span></a>
									</Link>
								</li>
								<li className={classNames({active: (this.state.url === '/category/reportages')})}>
									<Link href="/category/reportages">
										<a><span>Reportages</span></a>
									</Link>
								</li>
								<li className={classNames({active: (this.state.url === '/category/enquêtes')})}>
									<Link href="/category/enquêtes">
										<a><span>Enquêtes</span></a>
									</Link>
								</li>
								<li className={classNames({active: (this.state.url === '/category/opinions')})}>
									<Link href="/category/opinions">
										<a><span>Opinions</span></a>
									</Link>
								</li>
								<li className={classNames({active: (this.state.url === '/category/portraits')})}>
									<Link href="/category/portraits">
										<a><span>Portraits</span></a>
									</Link>
								</li>
							</ul>
						</li>
						<li className={classNames({active: (this.state.url === '/about')})}>
							<Link href="/about">
								<a><span>À propos</span></a>
							</Link>
						</li>
					</ul>
					{/* TODO: Search <Input slim type="search" placeholder="Rechercher…"/> */}
					<div className="buttons">
						<Button icon="email" size="30px" onClick={this.newsletterOpen}/>
						<Link href="/login">
							<Button icon="person" size="30px"/>
						</Link>
					</div>
					<Newsletter opened={this.state.newsletterOpened} onWantClose={this.newsletterWantClose}/>

					<style jsx>{`
						nav, ul {
							display: flex;
							flex-direction: row;
							align-items: flex-end;
							padding: 0;
							margin: 0;
						}

						ul li {
							display: block;
							margin-right: 15px;
						}

						ul li, ul li span {
							transition: all .15s ease-out;
						}

						ul li.active span, ul li:hover > a > span {
							color: var(--color-accent);
						}

						li.dropdown {
							position: relative;
							text-align: right;
						}

						li.dropdown > span::after {
							content: "";
							display: inline-block;
							height: ${20 / 16}rem;
							width: 24px;
							vertical-align: top;
							background: center/contain url("/api/icons/arrowDown?fill=${DefaultColorScheme.black.slice(1)}") no-repeat;
						}
						li.dropdown:hover > span::after {
							background-image: url("/api/icons/arrowDown?fill=${DefaultColorScheme.accent.slice(1)}");
						}

						li.dropdown ul {
							flex-direction: column;
							position: absolute;
							height: 0px;
							z-index: 200;
							overflow: hidden;
							top: 100%;
							right: 0;
							padding: 0;
							background: var(--color-background);
							border-right: 2px solid var(--color-black);
							transition: height .2s ease-out, padding 0s .2s linear;
						}

						li.dropdown:hover ul {
							height: calc(${20 / 16}rem * 5 + 15px * 6);
							padding: 0 15px 15px;
							transition: height .2s ease-out;
						}

						li.dropdown ul li {
							margin: 15px 0 0;
						}

						div.buttons {
							position: relative;
							top: 4px;
							width: ${60 + 15}px;
							padding-left: 7.5px;
							display: flex;
							justify-content: space-between;
						}
					`}
					</style>
				</nav>
			);
		}

		return (
			<>
				<div className="nav-button" onClick={this.openOrClose}>
					<span className={classNames('open', {disabled: (this.state.opened)})}>
						<Icon name="menu" width="100%" height="100%"/>
					</span>
					<span className={classNames('close', {disabled: (!this.state.opened)})}>
						<Icon name="close" width="100%" height="100%"/>
					</span>
				</div>

				<div
					className={classNames('darken', {disabled: (!this.state.opened)})}
					onClick={this.openOrClose}
				/>

				<nav
					className={classNames({disabled: (!this.state.opened)})}
				>
					<header>
						<h3>HETIC Newsroom</h3>
					</header>
					{/* TODO: Search <Input slim type="search" placeholder="Rechercher…"/> */}
					<ul>
						<li className={classNames({active: (this.state.url === '/')})}>
							<Link href="/">
								<a><h2>À la une</h2></a>
							</Link>
						</li>
						<li className={classNames({active: (this.state.url === '/category/interviews')})}>
							<Link href="/category/interviews">
								<a><h2>Interviews</h2></a>
							</Link>
						</li>
						<li className={classNames({active: (this.state.url === '/category/reportages')})}>
							<Link href="/category/reportages">
								<a><h2>Reportages</h2></a>
							</Link>
						</li>
						<li className={classNames({active: (this.state.url === '/category/enquêtes')})}>
							<Link href="/category/enquêtes">
								<a><h2>Enquêtes</h2></a>
							</Link>
						</li>
						<li className={classNames({active: (this.state.url === '/category/opinions')})}>
							<Link href="/category/opinions">
								<a><h2>Opinions</h2></a>
							</Link>
						</li>
						<li className={classNames({active: (this.state.url === '/category/portraits')})}>
							<Link href="/category/portraits">
								<a><h2>Portraits</h2></a>
							</Link>
						</li>
						<li className={classNames({active: (this.state.url === '/about')})}>
							<Link href="/about">
								<a><h2>À propos</h2></a>
							</Link>
						</li>
					</ul>
					<footer>
						<Button icon="email" onClick={this.newsletterOpen}/>
						<Link href="/login">
							<Button icon="person"/>
						</Link>
					</footer>
				</nav>
				<Newsletter opened={this.state.newsletterOpened} onWantClose={this.newsletterWantClose}/>

				<style jsx>{`
					.nav-button {
						height: 100%;
						position: relative;
						z-index: 300;
					}

					.nav-button span {
						font-size: 0;
					}

					.disabled {
						display: none;
					}

					.darken {
						z-index: 200;
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						background: rgba(0,0,0,0.2);
						backdrop-filter: blur(4px);
					}
					@keyframes fadeBackground {
						from {background: rgba(0,0,0,0);backdrop-filter: blur(0px);}
						to   {background: rgba(0,0,0,0.2);backdrop-filter: blur(4px);}
					}
					.darken:not(.disabled) {
						animation: .4s cubic-bezier(0,0,0,1) 0s 1 normal forwards fadeBackground;
					}

					nav {
						z-index: 250;
						position: fixed;
						top: 0;
						right: 0;
						width: 100vw;
						max-width: 300px;
						height: 100vh;
						overflow-y: auto;
						padding: 15px;
						background: var(--color-background);
						transition: right .4s cubic-bezier(0,0,0,1);
					}
					nav.disabled {
						display: block;
						right: -300px;
					}

					header {
						height: 54px;
						position: relative;
						top: -15px;
						display: flex;
						align-items: center;
					}

					@media (min-width: 660px) and (max-width: 1099px) {
						header {
							height: calc(54px + 5vmin);
							top: -4px;
						}
					}

					header h3 {
						position: relative;
						bottom: 0.5px;
						line-height: 1;
						font-weight: 700;
					}

					ul {
						padding: 0;
					}

					ul li {
						display: block;
						margin-top: 1.5rem;
					}

					ul li.active h2 {
						color: var(--color-accent);
					}

					footer {
						position: sticky;
						top: calc(100vh - 15px);
						display: flex;
						justify-content: space-between;
					}
				`}
				</style>
			</>
		);
	}
}
