import Link from 'next/link';
import Page from '../components/page';
import Button from '../components/button';
import Input from '../components/input';
import ArticleCard from '../components/article-card';
import Modal from '../components/modal';

export default () => {
	return (
		<Page>
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

			<div className="testZone">
				<Link href="/login">
					<Button primary value="Login"/>
				</Link>
				<Button value="Button"/>
				<Button icon="questionMark"/>
				<Button positive value="Create"/>
				<Button negative value="Delete"/>
				<Modal opened={false}>
					<h1>Hello there!</h1>
					<p>Fancy subscribing?</p>
				</Modal>
				<hr/>
				<Input type="search" placeholder="Search…"/>
				<Input type="email" placeholder="email@example.com"/>
				<Input type="password" placeholder="•••••••••••"/>
				<Button primary icon="chevronRight" value="Submit!"/>
				<Button positive icon="hash" value="OK"/>
				<Button icon="questionMark" value="Lorem ipsum dolor sit amet"/>
				<hr/>
				<ArticleCard title="Titre de l’article, qui se trouve être très long, c’est con!" category="Portraits" author="Johnny Mnemonic" image="https://images.unsplash.com/photo-1586462175816-c0e709898f01?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920"/>
				<ArticleCard title="Titre de l’article" category="Interviews" author="Bill" image="https://images.unsplash.com/photo-1586462175816-c0e709898f01?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1920"/>
			</div>

			<style jsx global>{`
				.testZone {
					padding: 15px;
				}

				.testZone > * {
					margin: 15px 0;
				}
			`}
			</style>
		</Page>
	);
};
