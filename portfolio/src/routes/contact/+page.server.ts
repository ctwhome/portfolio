export async function load({}) {
	// fetch page from wordpress json api
	const res = await fetch(`https://portfolio.ctwhome.com/wp-json/wp/v2/pages?slug=pricing}`);
	const page = await res.json();

	return {
		page
	};
}
