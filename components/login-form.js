import * as React from 'react';
import Router from 'next/router';
import {Email, UnhashedPassword} from '../lib/data-validator';
import Input from './input';
import Button from './button';

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			badfields: [],
			email: '',
			password: ''
		};

		this.submit = this.submit.bind(this);
		this.setEmailValue = this.setEmailValue.bind(this);
		this.setPasswordValue = this.setPasswordValue.bind(this);
	}

	async componentDidMount() {
		const token = window.localStorage.getItem('login_token');
		const response = await window.fetch(`/api/auth?token=${token}`);
		const parsed = await response.json();

		if (response.ok && parsed.token === token) {
			Router.push('/contributors');
		}
	}

	setEmailValue(event) {
		this.setState({
			email: event.target.value
		});
	}

	setPasswordValue(event) {
		this.setState({
			password: event.target.value
		});
	}

	async submit(event) {
		event.preventDefault();

		if (!this.state.email || !Email.test(this.state.email)) {
			this.setState({
				badfields: ['email']
			});
		}

		if (!this.state.password || !UnhashedPassword.test(this.state.password)) {
			this.setState({
				badfields: ['password']
			});
		}

		const response = await window.fetch('/api/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password
			})
		});

		const parsed = await response.json();

		switch (response.status) {
			case 201:
				window.localStorage.setItem('login_token', parsed.token);
				Router.push('/contributors');
				break;
			case 400:
				this.setState({
					badfields: ['email', 'password']
				});
				break;
			case 404:
				this.setState({
					badfields: ['email', 'password']
				});
				break;
			case 403:
				this.setState({
					badfields: ['password']
				});
				break;
			default:
				this.setState({
					badfields: ['default']
				});
		}
	}

	render() {
		return (
			<div className="loginForm">
				<h2>Espace<br/>Contributeurs</h2>
				<h3>Connectez-vous pour gérer et éditer vos publications.</h3>

				<form className="inputsContainer" onSubmit={this.submit}>
					<Input value={this.state.email} className={this.state.badfields.includes('email') ? 'invalid stretch' : 'stretch'} type="email" placeholder="email@example.com" onChange={this.setEmailValue}/>
					{
						this.state.badfields.includes('email') &&
							<h4 className="error">L’adresse e-mail est incorrecte.</h4>
					}
					<Input value={this.state.password} className={this.state.badfields.includes('password') ? 'invalid stretch' : 'stretch'} type="password" placeholder="•••••••••••" onChange={this.setPasswordValue}/>
					{
						this.state.badfields.includes('password') &&
							<h4 className="error">Le mot de passe est incorrect.</h4>
					}
					{
						this.state.badfields.includes('default') &&
							<h4 className="error">Une erreur inconnue est survenue, veuillez réessayer plus tard.</h4>
					}

					<div className="buttonContainer">
						<Button icon="questionMark"/>
						<Button primary icon="chevronRight" value="Connexion" type="submit"/>
					</div>
				</form>

				<style jsx>{`
			h2 {
				margin-bottom: 3px;
			}
			
			h3 {
				margin-bottom: 20px;
			}
			h4.error{
				padding-left: 15px;
				color: var(--color-negative);
				font-weight: 500;
			}
			
			.inputsContainer {
				display: grid;
				grid-template-rows: repeat(2, auto);
				grid-template-columns: 1fr;
				grid-row-gap: 15px;
				margin-bottom: 20px;
			}
			
			.buttonContainer {
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
			}
			`}
				</style>
			</div>
		);
	}
}
