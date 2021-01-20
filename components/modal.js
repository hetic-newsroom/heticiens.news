import classNames from 'classnames';

const Modal = props => (
	<>
		<div
			className={classNames(
				'modal',
				{hidden: (!props.opened)}
			)}
			onClick={props.onWantClose}
		>
			<div
				className="modalBox"
				onClick={e => e.stopPropagation()}
			>
				{props.children}
			</div>
		</div>

		<style jsx>{`
			.modal {
				z-index: 150;
				position: fixed;
				top: 0;
				right:0;
				bottom: 0;
				left: 0;
				background: rgba(0,0,0,0.2);
				backdrop-filter: blur(4px);
				display: flex;
				padding: 15px;
			}

			.modalBox {
				margin: auto;
				max-width: 100%;
				background: var(--color-background);
				padding: 20px;
				border-radius: 20px;
			}

			.hidden {
				display: none;
			}
		`}
		</style>
	</>
);

export default Modal;
