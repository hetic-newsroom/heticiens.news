import * as React from 'react';
import fetch from 'isomorphic-unfetch';
import classNames from 'classnames';
import {nanoid} from 'nanoid';
import DefaultColorScheme from '../lib/colors-default';
import {Email} from '../lib/data-validator';
import Modal from './modal';
import Input from './input';
import Icon from './icon';
import Button from './button';

export default class Newsletter extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			status: null
		};
		this.id = nanoid();

		this.submit = this.submit.bind(this);
	}

	submit() {
		const email = document.querySelector(`#newsletterForm-${this.id}`).value;
		if (!Email.test(email)) {
			this.setState({
				status: 'badInput'
			});
			return;
		}

		this.setState({
			status: 'submitted'
		}, () => {
			fetch(`/api/newsletter/register/${email}`);
		});
	}

	render() {
		return (
			<Modal opened={this.props.opened} onWantClose={this.props.onWantClose}>
				{
					(this.state.status === null || this.state.status === 'badInput') &&
						<>
							<h2>La Newsroom<br/>dans votre inbox.</h2>
							<h3>
								Inscrivez-vous pour être informé des nouvelles publications.
							</h3>
							<div className="inputContainer">
								<Input
									id={`newsletterForm-${this.id}`}
									type="email"
									placeholder="mail@example.com"
								/>
								<h4
									className={classNames(
										{disabled: (this.state.status !== 'badInput')}
									)}
								>
									Cette addresse n’est pas valide.
								</h4>
							</div>
							<div className="buttonContainer">
								<Button
									accent
									icon="send"
									value="S’inscrire"
									onClick={this.submit}
								/>
							</div>
						</>
				}

				{
					this.state.status === 'submitted' &&
						<div className="success">
							<div className="loveContainer">
								<Icon name="heart" width="68px" height="68px" color={DefaultColorScheme.accent}/>
							</div>
							<h2>À bientôt !</h2>
							<h3>
								Nous vous avons envoyé un lien de confirmation.
							</h3>
							<div className="buttonContainer">
								<Button
									value="OK"
									onClick={this.props.onWantClose}
								/>
							</div>
						</div>
				}

				<style jsx>{`
					h2, h3, .inputContainer, .loveContainer {
						margin-bottom: 20px;
					}

					.buttonContainer {
						display: flex;
						justify-content: center;
					}

					h3 {
						max-width: 318px;
					}

					h4 {
						text-align: center;
						color: var(--color-negative);
						margin-top: 5px;
					}

					.disabled {
						display: none;
					}

					@keyframes love {
						from {transform: scale(1);}
						50%  {transform: scale(1.1);}
						to   {transform: scale(1);}
					}

					.loveContainer {
						display: flex;
						align-items: center;
						justify-content: center;
						animation: 1s love ease-in-out .3s 2;
					}

					.success h2 {
						text-align: center;
					}
				`}
				</style>
			</Modal>
		);
	}
}
