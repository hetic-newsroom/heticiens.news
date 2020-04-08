import DefaultColorScheme from '../lib/colors-default';

export default props => (
	<>
		<label>
			<input {...props}/>
			<i className="input-icon"/>
		</label>
		<style jsx>{`
			label {
				display: block;
				position: relative;
				width: 200px;
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
				width: 100%;
				box-sizing: content-box;
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
		`}
		</style>
	</>
);
