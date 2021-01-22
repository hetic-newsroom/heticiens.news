export default function Home() {
	return <>
		<h1>hetic newzrom</h1>
	</>
}

export async function getStaticProps() {
	return {
		props: {
			static: true
		}
	}
}
