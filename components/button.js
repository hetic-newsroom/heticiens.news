import * as React from 'react';
import classNames from 'classnames';
import DefaultColorScheme from '../lib/colors-default';

export default React.forwardRef((props, ref) => (
	<button
		ref={ref}
		className={classNames(
			{icon: (props.icon)},
			{text: (props.value)},
			{primary: (props.primary)},
			{positive: (props.positive)},
			{negative: (props.negative)}
		)}
		type="button"
		onClick={props.onClick}
	>
		{props.value ? <span>{props.value}</span> : ''}
		<style jsx>{`
			button {
				--bg: var(--color-light-grey);
				--fg: var(--color-black);

				-webkit-appearance: none;
				outline: none;
				display: block;
				min-width: 100px;
				padding: 10px 15px;
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
				position: relative;
			}
			button.icon.text {
				padding-right: calc(${20 / 16}rem + ${10 + (4 * 2)}px);
			}
			button.icon:not(.text) {
				min-width: inherit;
				width: ${(props.size) ? props.size : `calc(${20 / 16}rem + ${(10 * 2) + (4 * 2)}px)`};
				height: ${(props.size) ? props.size : `calc(${20 / 16}rem + ${(10 * 2) + (4 * 2)}px)`};
				padding: 0px;
				border-radius: ${(props.size) ? `calc(${props.size} * 0.375)` : '15px'};
			}
			button.icon::after {
				content: "";
				display: block;
				position: absolute;
				top: -4px;
				right: -4px;
				width: calc(${20 / 16}rem + ${(10 * 2) + (4 * 2)}px);
				height: calc(${20 / 16}rem + ${(10 * 2) + (4 * 2)}px);
				background: center/${20 / 16}rem url("/api/icons/${props.icon}?fill=${DefaultColorScheme.black.replace('#', '')}") no-repeat;
			}
			button.icon:not(.text)::after {
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-size: ${(props.size) ? `calc(${props.size} * 0.775)` : '31px'};
			}
			button.primary::after, button.positive::after, button.negative::after {
				background-image: url("/api/icons/${props.icon}?fill=${DefaultColorScheme.white.replace('#', '')}");
			}
			button.icon:hover:not(:focus)::after {
				filter: invert(100);
			}
			button.positive.icon:hover:not(:focus)::after {
				background-image: url("/api/icons/${props.icon}?fill=${DefaultColorScheme.positive.replace('#', '')}");
				filter: none;
			}
			button.negative.icon:hover:not(:focus)::after {
				background-image: url("/api/icons/${props.icon}?fill=${DefaultColorScheme.negative.replace('#', '')}");
				filter: none;
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
