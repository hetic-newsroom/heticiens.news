import * as React from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import Icon from './icon';
import Button from './button';
import Input from './input';

export default class NavMenuMobile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			opened: false
		};

		this.openOrClose = this.openOrClose.bind(this);
	}

	componentDidMount() {
		// TODO: swipe handler?
	}

	openOrClose() {
		this.setState(state => ({opened: !state.opened}));
	}

	render() {
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
					<Input type="search" placeholder="Rechercher…"/>
					<ul>
						<li className="active">
							<Link href="#">
								<h2>À la une</h2>
							</Link>
						</li>
						<li>
							<Link href="#">
								<h2>Interviews</h2>
							</Link>
						</li>
						<li>
							<Link href="#">
								<h2>Reportages</h2>
							</Link>
						</li>
						<li>
							<Link href="#">
								<h2>Enquêtes</h2>
							</Link>
						</li>
						<li>
							<Link href="#">
								<h2>Opinions</h2>
							</Link>
						</li>
						<li>
							<Link href="#">
								<h2>Portraits</h2>
							</Link>
						</li>
						<li>
							<Link href="#">
								<h2>À propos</h2>
							</Link>
						</li>
					</ul>
					<footer>
						<Button icon="hash"/>
						<Link href="/login">
							<Button icon="person"/>
						</Link>
					</footer>
				</nav>

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
						background: #000;
						opacity: 0.25;
					}
					@keyframes fadeBackground {
						from {opacity: 0;}
						to   {opacity: 0.25;}
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
