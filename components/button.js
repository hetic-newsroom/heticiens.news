import * as React from 'react';

export default React.forwardRef((props, ref) => (
	<button
		ref={ref}
		className={
			(props.icon && 'icon') ||
			(props.primary && 'primary') ||
			(props.positive && 'positive') ||
			(props.negative && 'negative')
		}
		type="button"
		onClick={props.onClick}
	>
		{props.children}
		<style jsx>{`
			button {
				--bg: var(--color-light-grey);
				--fg: var(--color-black);

				-webkit-appearance: none;
				outline: none;
				display: block;
				min-width: 160px;
				padding: 10px 15px;
				margin: 10px;
				cursor: pointer;

				background: var(--bg);
				color: var(--fg);
				border: 4px solid var(--bg);
				border-radius: 4px;
				box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
				transform: scale(1);

				transition: .2s ease-out;
			}
			button:hover {
				background: var(--fg);
				color: var(--bg);
				border-color: var(--fg);
				box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
				transform: scale(1.05);
			}
			button:active, button:focus {
				background: var(--bg);
				color: var(--fg);
				transform: scale(1.05);
			}

			button.icon {
				min-width: inherit;
				width: 54px;
				height: 54px;
				padding: 0px;
				border-radius: 15px;
			}

			button.primary:hover, button.positive:hover, button.negative:hover {
				border-color: var(--bg);
			}

			button.primary {
				--bg: var(--color-black);
				--fg: var(--color-white);
			}

			button.positive {
				--bg: var(--color-positive);
				--fg: var(--color-white);
			}

			button.negative {
				--bg: var(--color-negative);
				--fg: var(--color-white);
			}
		`}
		</style>
	</button>
));
