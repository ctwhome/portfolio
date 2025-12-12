<script>
	import TiltContent from '$components/TiltContent.svelte';

	let apps = [
		{
			name: 'IdeasDiamond',
			description: 'This is my app',
			image: '/images/ideasdiamond.avif',
			url: 'https://www.ideasdiamond.com'
		},
		{
			name: 'Notidian',
			description: 'This is my app',
			image: '/images/notidian.avif',
			url: 'https://notidian.com'
		},
		{
			name: 'NextHuman',
			description: 'Health journal and tracker',
			image: '/images/nexthuman.avif',
			url: 'https://nexthuman.app'
		},
		{
			name: 'ValorList',
			description: 'This is my app',
			image: '/images/valorlist.avif',
			url: 'https://www.valorlist.com'
		},
		{
			name: 'IsTheFood',
			description: 'This is my app',
			image: '/images/isthefood.avif',
			url: 'https://www.isthefood.com'
		},
		{
			name: 'SuperTaal',
			description: 'This is my app',
			image: '/images/supertaal.avif',
			url: 'https://www.supertaal.com'
		}
	];
</script>

<div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
	{#each apps as app}
		<TiltContent>
			<a
				href={app.url}
				target="_blank"
				class="card block aspect-[5/3] bg-cover p-4 !no-underline"
				style="background-image: url({app.image})"
				aria-label={app.name}
			>
				<!-- First element content -->
				<!-- <p class="">{app.name}</p>
				<p>{app.description}</p> -->
			</a>
		</TiltContent>
	{/each}
</div>
