<script lang="ts">
	import {
		Hello,
		Carousel,
		TiltContent,
		ThemeChange,
		SendEmail,
		FeedbackButton,
		SEO,
		Toggle,
		type SiteSettings
	} from 'ctw-kit';

	import IconMail from '~icons/ph/envelope-simple-fill';
	import IconHeart from '~icons/ph/heart-fill';
	import IconStar from '~icons/ph/star-fill';

	const userInfo = {
		id: 'demo123',
		name: 'Demo User',
		email: 'demo@example.com',
		photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
	};

	const siteSettings: SiteSettings = {
		title: 'CTW Kit Demo',
		description: 'Demo page for CTW Kit components',
		image: '/favicon.png',
		baseUrl: 'https://ctwhome.com'
	};
</script>

<SEO {siteSettings} />

<div class="bg-base-100 min-h-screen p-8">
	<div class="mx-auto max-w-4xl space-y-8">
		<div class="flex items-center justify-between">
			<h1 class="text-3xl font-bold">CTW Kit Component and Utilities Librabry</h1>
			<ThemeChange />
		</div>

		<div class=" mt-4">
			This is a collection of components and utilities for Svelte and TailwindCSS (DaisyUI):
			<span class="bg-base-200 whitespace-nowrap rounded p-2">bun add ctw-kit</span>
		</div>

		<!-- Toggle Component -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Toggle Component</h2>
				<div class="space-y-4">
					<div class="flex gap-4">
						<div>
							<p class="mb-2 text-sm font-medium">Basic Toggle:</p>
							<Toggle />
						</div>

						<div>
							<p class="mb-2 text-sm font-medium">Toggle with Label:</p>
							<Toggle label="Enable notifications" />
						</div>

						<div>
							<p class="mb-2 text-sm font-medium">Controlled Toggle:</p>
							<Toggle
								checked={true}
								onChange={(event: { checked: boolean }) => {
									console.log('Toggle changed:', event.checked);
								}}
							/>
						</div>

						<div>
							<p class="mb-2 text-sm font-medium">Custom Styled Toggle:</p>
							<Toggle className="toggle-primary" label="Primary color" />
						</div>
					</div>

					<div class="mt-4 text-sm opacity-70">
						<p>Usage example:</p>
						<pre class="bg-base-300 mt-1 rounded p-2">{`<Toggle
  checked={true}
  label="Enable notifications"
  className="toggle-primary"
  onChange={(event: { checked: boolean }) => console.log('Toggle changed:', event.checked)}
/>`}</pre>
					</div>
				</div>
			</div>
		</div>

		<!-- Icons Demo -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Icons (unplugin-icons)</h2>
				<div class="flex gap-4">
					<button class="btn btn-primary">
						<IconMail class="h-5 w-5" />
						<span>Email</span>
					</button>
					<button class="btn btn-secondary">
						<IconHeart class="h-5 w-5" />
						<span>Like</span>
					</button>
					<button class="btn btn-accent">
						<IconStar class="h-5 w-5" />
						<span>Star</span>
					</button>
				</div>
				<div class="mt-4 text-sm opacity-70">
					<p>Import icons using:</p>
					<pre
						class="bg-base-300 mt-1 rounded p-2">import IconName from '~icons/ph/icon-name';</pre>
				</div>
			</div>
		</div>

		<!-- Hello Component -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Hello Component</h2>
				<div class="space-y-4">
					<Hello name="World" />
				</div>
			</div>
		</div>

		<!-- Carousel Component -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Carousel Component</h2>
				<Carousel />
			</div>
		</div>

		<!-- TiltContent Component -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">TiltContent Component</h2>
				<div class="grid grid-cols-2 gap-4">
					<TiltContent>
						<div class="card bg-primary text-primary-content p-8 text-center">Hover me!</div>
					</TiltContent>
					<TiltContent>
						<div class="card bg-secondary text-secondary-content p-8 text-center">Me too!</div>
					</TiltContent>
				</div>
			</div>
		</div>

		<!-- Feedback Component -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Feedback Component</h2>
				<div class="flex items-center gap-4">
					<FeedbackButton {userInfo} />
					<p class="text-sm opacity-70">Click to open feedback modal</p>
				</div>
			</div>
		</div>

		<!-- SendEmail Component -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">SendEmail Component</h2>
				<SendEmail />
			</div>
		</div>

		<!-- Theme Demo -->
		<div class="card bg-base-200 shadow-xl">
			<div class="card-body">
				<h2 class="card-title mb-4">Theme Examples</h2>
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<div class="badge">Default Badge</div>
						<div class="badge badge-primary">Primary</div>
						<div class="badge badge-secondary">Secondary</div>
						<div class="badge badge-accent">Accent</div>
					</div>
					<div class="space-y-2">
						<button class="btn">Default Button</button>
						<button class="btn btn-primary">Primary</button>
						<button class="btn btn-secondary">Secondary</button>
						<button class="btn btn-accent">Accent</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
