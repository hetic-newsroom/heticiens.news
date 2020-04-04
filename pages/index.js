import * as React from 'react';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('../components/editor.js'), {
	ssr: false
});

export default class Index extends React.Component {
	render() {
		return (
			<div className="root">
				<Editor/>
				<style jsx global>{`
					html, body {
						margin: 0;
					}
				`}
				</style>
				<style jsx>{`
					.root {
						font-family: sans-serif;
						height: 100vh;
						width: 100vw;
						display: flex;
					}
				`}
				</style>
			</div>
		);
	}
}
