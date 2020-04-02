import * as React from 'react';

const deadline = new Date('April 16, 2020 15:00:00 UTC+1').getTime();

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			s: 'XX',
			m: 'XX',
			h: 'XX'
		};
	}

	componentDidMount() {
		this.updateClock();
		this.timer = setInterval(() => {
			this.updateClock();
		}, 1000);
	}

	updateClock() {
		let timer = Math.floor((deadline - Date.now()) / 1000);
		const s = timer % 60;
		timer = (timer - s) / 60;
		const m = timer % 60;
		const h = (timer - m) / 60;

		this.setState({
			s,
			m,
			h
		});
	}

	render() {
		return (
			<div className="root">
				<h1>
					{this.state.h}:{this.state.m}:{this.state.s}
				</h1>
				<style jsx global>{`
					html, body {
						margin: 0;
					}
				`}
				</style>
				<style jsx>{`
					.root {
						background: black;
						color: white;
						font-family: sans-serif;
						height: 100vh;
						width: 100vw;
						display: flex;
					}

					h1 {
						margin: auto;
						font-size: 3rem;
					}
				`}
				</style>
			</div>
		);
	}
}

export default Index;
