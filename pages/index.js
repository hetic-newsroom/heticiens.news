import Link from 'next/link';
import GlobalStyles from '../components/global-styles';
import Button from '../components/button';

export default () => {
	return (
		<div className="root">
			<h1>Welcome!</h1>
			<h3>To <strong>staging.heticiens.news</strong></h3>
			<h2>Test zone</h2>
			<h4>Try some stuff out!</h4>
			<h5>Im so tiny</h5>
			<h6>say whaaaaat?</h6>
			<p>
				Lorem ipsum <strong>dolor</strong> sit <i>amet</i>.<br/>Dolor
				perspiciatis id molestias eum sed. Autem aliquam magnam
				animi. Qui quam aut ullam totam vero nobis. Iure architecto esse
				iste. Aut inventore quam voluptatibus molestiae enim aut. Repellat
				officia numquam architecto.
			</p>
			<Link href="/login">
				<Button primary>
					<span>Login</span>
				</Button>
			</Link>
			<Button>
				<span>Button</span>
			</Button>
			<Button icon>
				<span>O</span>
			</Button>
			<Button positive>
				<span>Create</span>
			</Button>
			<Button negative>
				<span>Delete</span>
			</Button>

			<GlobalStyles/>
			<style jsx>{`
				.root {
					height: 100vh;
					width: 100vw;
					padding: 30px;
				}
			`}
			</style>
		</div>
	);
};
