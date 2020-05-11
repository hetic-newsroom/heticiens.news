import * as React from 'react';
import classNames from 'classnames';

export default props => (
	<div
		className={classNames(
			{flashMessage: true},
			{primary: (props.primary)},
			{positive: (props.positive)},
			{negative: (props.negative)},
			{accent: (props.accent)}
		)}
	>
		{props.children}
		<style jsx>{`
			div.flashMessage {
				--bg: var(--color-light-grey);
				--fg: var(--color-black);

				-webkit-appearance: none;
				outline: none;
				display: block;
				min-width: 100px;
				padding: 10px 15px;
				cursor: default;

				background: var(--bg);
				color: var(--fg);
				border: 4px solid var(--bg);
				border-radius: 4px;
				box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
				transform: scale(1);

				transition: .2s ease-out;
				margin-bottom: 20px;
			}
			div.flashMessage:hover {
				background: var(--fg);
				color: var(--bg);
				border-color: var(--fg);
				box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
				transform: scale(1.05);
			}
			
			div.flashMessage.primary:hover, div.flashMessage.positive:hover, div.flashMessage.negative:hover, div.flashMessage.accent:hover {
				border-color: var(--bg);
			}

			div.flashMessage.primary {
				--bg: var(--color-black);
				--fg: var(--color-white);
			}

			div.flashMessage.positive {
				--bg: var(--color-positive);
				--fg: var(--color-white);
			}

			div.flashMessage.negative {
				--bg: var(--color-negative);
				--fg: var(--color-white);
			}

			div.flashMessage.accent {
				--bg: var(--color-accent);
				--fg: var(--color-white);
			}
		`}
		</style>
	</div>
);
