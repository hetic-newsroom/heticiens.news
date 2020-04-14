import classNames from 'classnames';
import DefaultColorScheme from '../lib/colors-default';

export default tprops => {
	const props = {...tprops};
	delete props.slim;

	return (
		<>
			<label className={classNames({slim: (tprops.slim)})}>
				<input
					className={classNames(
						{slim: (tprops.slim)}
					)}
					{...props}
				/>
				<i className="input-icon"/>
			</label>
			<style jsx>{`
				label {
					display: block;
					position: relative;
					min-width: 200px;
					transform: scale(1);
					transition: .2s ease-out;
				}
				label:hover, label:active, label:focus-within {
					transform: scale(1.05);
				}

				input {
					--bg: var(--color-light-grey);
					--fg: var(--color-black);

					-webkit-appearance: none;
					outline: none;
					max-width: 100%;
					padding: 10px 15px;

					background: var(--bg);
					color: var(--fg);
					border: 4px solid var(--bg);
					border-radius: 15px;
					box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);

					transition: .2s ease-out;
				}
				input:hover, input:active, input:focus {
					box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1);
				}
				input:invalid, input.invalid {
					text-decoration: wavy underline var(--color-negative);
				}

				input[type="email"], input[type="password"], input[type="search"] {
					padding-left: 48px;
				}
				input[type="email"] + .input-icon, input[type="password"] + .input-icon, input[type="search"] + .input-icon {
					display: block;
					position: absolute;
					top: 11px;
					left: 15px;
					width: ${27 / 16}rem;
					height: ${27 / 16}rem;
					background: center/cover url("/api/icons/at?fill=${DefaultColorScheme.darkGrey.replace('#', '')}") no-repeat;
				}

				input[type="email"] + .input-icon {
					background: center/cover url("/api/icons/at?fill=${DefaultColorScheme.darkGrey.replace('#', '')}") no-repeat;
				}

				input[type="password"] + .input-icon {
					background: center/cover url("/api/icons/hash?fill=${DefaultColorScheme.darkGrey.replace('#', '')}") no-repeat;
				}

				input[type="search"] + .input-icon {
					background: center/cover url("/api/icons/search?fill=${DefaultColorScheme.darkGrey.replace('#', '')}") no-repeat;
				}

				label.slim {
					min-width: 0;
					width: 170px;
					position: relative;
				}
				label.slim:hover, label.slim:focus-within, label.slim:active {
					transform: none;
				}
				label.slim:focus-within {
					width: 230px;
				}

				input.slim {
					position: absolute;
					bottom: -4px;
					left: 0;
					width: 170px;
					box-sizing: border-box;
					overflow: hidden;
					// font-size: 1.1rem;
					padding: 0 0 0 calc(4px + ${22 / 16}rem);
					background: transparent;
					border-color: transparent;
				}
				input.slim:hover, input.slim:active, input.slim:focus {
					background: var(--color-light-grey);
					border-color: var(--color-light-grey);
				}

				input.slim:focus {
					bottom: -8px;
					width: 230px;
					padding-top: 5px;
					padding-bottom: 5px;
				}

				input.slim + i.input-icon {
					top: unset;
					bottom: 0px;
					left: 4px;
					width: ${22 / 16}rem;
					height: ${22 / 16}rem;
					transition: all .2s ease-out;
				}
			`}
			</style>
		</>
	);
};
