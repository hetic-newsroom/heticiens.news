import * as React from 'react';
import Router from 'next/router';
import {Email, UnhashedPassword} from '../lib/data-validator';
import Input from './input';
import Button from './button';

export default class AccountCreator extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;

		this.state = {
			sex: 'F',
			name: '',
			email: '',
			password: '',
			picture: null,
			bio: '',
			loading: false,
			social: {}
		};

		this.submit = this.submit.bind(this);
		this.setNameValue = this.setNameValue.bind(this);
		this.setEmailValue = this.setEmailValue.bind(this);
		this.setPasswordValue = this.setPasswordValue.bind(this);
		this.setSexValue = this.setSexValue.bind(this);
		this.setBioValue = this.setBioValue.bind(this);
		this.setFileValue = this.setFileValue.bind(this);
		this.setSocialValue = this.setSocialValue.bind(this);
	}

	async componentDidMount() {
		const token = window.localStorage.getItem('login_token');
		const userId = token.split('||')[0];

		// Get auth user moderator level
		const contributorRequest = await fetch(`/api/contributor/${userId}?token=${token}`);
		let contributor;
		try {
			contributor = await contributorRequest.json();
		} catch (_) {
			Router.push('/403');
			return;
		}

		if (contributor.moderator < 2) {
			Router.push('/403');
			return;
		}

		this.setState({
			token
		});
	}

	setNameValue(event) {
		this.setState({
			name: event.target.value
		});
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

	setSexValue(event) {
		this.setState({
			sex: event.target.value
		});
	}

	setBioValue(event) {
		this.setState({
			bio: event.target.value
		});
	}

	setFileValue(event) {
		// Convert image file to base64
		const reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.addEventListener('load', () => {
			this.setState({
				picture: reader.result
			});
		});
	}

	setSocialValue(network, event) {
		const previous = this.state.social;
		this.setState({
			social: {
				...previous,
				[network]: event.target.value
			}
		});
	}

	async submit(event) {
		event.preventDefault();

		if (this.state.email && !Email.test(this.state.email)) {
			this.setState({
				error: 'Le champ e-mail est incorrect.'
			});
			return;
		}

		if (this.state.password && !UnhashedPassword.test(this.state.password)) {
			this.setState({
				error: 'Le champ mot de passe est incorrect (6 caractères minimum).'
			});
			return;
		}

		if (!this.state.bio || this.state.bio.length < 140 || this.state.bio.length > 2000) {
			this.setState({
				error: 'La biographie ne correspond pas au standard : celle-ci doit faire au minimum 140 caractères et au maximum 2000 caractères.'
			});
			return;
		}

		this.setState({
			loading: true
		});

		const response = await window.fetch('/api/contributor/new', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: this.state.token,
				contributor: {
					name: this.state.name,
					sex: this.state.sex,
					email: this.state.email,
					picture: this.state.picture || 'no-picture',
					bio: this.state.bio,
					password: this.state.password,
					social: this.state.social
				}
			})
		});

		let parsed;
		try {
			parsed = await response.json();
		} catch (_) {
			parsed = {};
		}

		switch (response.status) {
			case 201:
				console.log(parsed.id);
				Router.push(`/author/${parsed.id}`);
				break;
			case 400:
			case 404:
				this.setState({
					error: parsed.error,
					loading: false
				});
				break;
			case 403:
				this.setState({
					error: 'Accès refusé.',
					loading: false
				});
				break;
			default:
				this.setState({
					error: 'Une erreur inconnue est survenue, veuillez réessayer plus tard.',
					loading: false
				});
		}
	}

	render() {
		return (
			<div className="loginForm">
				<h2>Créer un profil contributeur</h2>

				<br/>
				<form className="inputsContainer" onSubmit={this.submit}>
					<h2>Identifiants de connexion</h2>
					<Input
						value={this.state.email}
						disabled={this.state.loading}
						className="stretch"
						type="email"
						placeholder="email@example.com"
						onChange={this.setEmailValue}
					/>

					<Input
						value={this.state.password}
						disabled={this.state.loading}
						className="stretch"
						type="password"
						placeholder="•••••••••••"
						onChange={this.setPasswordValue}
					/>

					<h2>Profil public</h2>
					<Input
						value={this.state.name}
						disabled={this.state.loading}
						className="stretch"
						type="text"
						placeholder="John Dupont"
						onChange={this.setNameValue}
					/>
					<input
						type="file"
						value={this.state.file}
						disabled={this.state.loading}
						accept=".jpg,.jpeg,.png,.gif,.svg"
						onChange={this.setFileValue}
					/>
					<textarea
						value={this.state.bio}
						disabled={this.state.loading}
						placeholder="Cursus Héticien (Promo 2011) • Intéressé par <?>. Encore plus d'informations sur moi"
						onChange={this.setBioValue}
					/>

					<select value={this.state.sex} onChange={this.setSexValue}>
						<option value="F">Femme</option>
						<option value="H">Homme</option>
					</select>

					<Input
						value={this.state.social.twitter}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="twitter"
						placeholder="https://twitter.com/"
						onChange={event => this.setSocialValue('twitter', event)}
					/>

					<Input
						value={this.state.social.linkedin}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="linkedin"
						placeholder="https://linkedin.com/in/"
						onChange={event => this.setSocialValue('linkedin', event)}
					/>

					<Input
						value={this.state.social.facebook}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="facebook"
						placeholder="https://facebook.com/"
						onChange={event => this.setSocialValue('facebook', event)}
					/>

					<Input
						value={this.state.social.instagram}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="instagram"
						placeholder="https://instagram.com/"
						onChange={event => this.setSocialValue('instagram', event)}
					/>

					<Input
						value={this.state.social.website}
						disabled={this.state.loading}
						className="stretch"
						type="url"
						social="website"
						placeholder="https://heticiens.news/"
						onChange={event => this.setSocialValue('website', event)}
					/>

					{
						this.state.error &&
							<h4 className="error">{this.state.error}</h4>
					}

					<div className="buttonContainer">
						<Button primary value="Créer le profil" type="submit"/>
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

					textarea {
						--bg: var(--color-light-grey);
						--fg: var(--color-black);

						-webkit-appearance: none;
						outline: none;
						// max-width: 100%;
						padding: 10px 15px;

						background: var(--bg);
						color: var(--fg);
						border: 4px solid var(--bg);
						border-radius: 15px;
						box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);

						font-size: 1.125rem;
						resize: vertical;
						min-height: 150px;
					}

					.buttonContainer {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-end;
					}
				`}
				</style>
			</div>
		);
	}
}
