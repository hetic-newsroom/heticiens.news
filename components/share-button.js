import * as React from 'react';
import Modal from './modal';
import Button from './button';

export default class Share extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			opened: false
		};

		this.handleSharingQuit = this.handleSharingQuit.bind(this);
	}

	share() {
		if (typeof navigator !== 'undefined' && navigator.share) {
			navigator.share({
				...this.props.title,
				url: window.location
			}).catch(() => {
				// User aborted sharing, we don't care
			});
		} else {
			this.setState({
				opened: true
			});
		}
	}

	handleSharingQuit() {
		this.setState({
			opened: false
		});
	}

	render() {
		return (
			<>
				<Button
					primary
					icon="share"
					value="Partager"
					onClick={() => {
						this.share(this.props.title);
					}}
				/>

				<Modal opened={this.state.opened} onWantClose={this.handleSharingQuit}>
					{this.props.type === 'author' ? <h2>Partager ce contributeur</h2> : <h2>Partager cet article</h2>}
					<div className="buttonContainer">
						<a href={`https://twitter.com/share?text=${this.props.link}%20via%20@hetic_newsroom`} target="_blank" rel="noopener noreferrer">
							<Button icon="twitter" size="30px"/>
						</a>
						<a href={`https://www.facebook.com/sharer/sharer.php?u=${this.props.link}`} target="_blank" rel="noopener noreferrer">
							<Button icon="facebook" size="30px"/>
						</a>
						<a href={`https://www.linkedin.com/sharing/share-offsite/?url=${this.props.link}`} target="_blank" rel="noopener noreferrer">
							<Button icon="linkedin" size="30px"/>
						</a>
						<a href={`mailto:?body=${this.props.link}`} target="_blank" rel="noopener noreferrer">
							<Button icon="email" size="30px"/>
						</a>
					</div>
					<style jsx>{`
						h2, h3 {
							margin-bottom: 20px;
						}

						.buttonContainer {
							display: flex;
							justify-content: space-evenly;
						}
					`}
					</style>
				</Modal>
			</>
		);
	}
}
