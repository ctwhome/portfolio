<script lang="ts">
	import Brain from '~icons/lucide/brain';
	import Code2 from '~icons/lucide/code-2';
	import Compass from '~icons/lucide/compass';
	import FlaskConical from '~icons/lucide/flask-conical';
	import GitBranch from '~icons/lucide/git-branch';
	import Layout from '~icons/lucide/layout';
	import ShieldCheck from '~icons/lucide/shield-check';
	import Sparkles from '~icons/lucide/sparkles';
	import Target from '~icons/lucide/target';
	import Users from '~icons/lucide/users';

	const transformations = [
		['Research code', 'usable scientific product'],
		['Messy knowledge work', 'calm AI-native workflow'],
		['Technical value', 'fundable product story'],
		['Prototype', 'adoption-ready system']
	];

	const principles = [
		{
			icon: Target,
			title: 'Problem selection before production',
			text: 'The first question is not “what can AI generate?” It is “what domain problem is valuable enough to deserve a system?”'
		},
		{
			icon: Brain,
			title: 'AI-native, not AI-decorated',
			text: 'Models, agents, retrieval, structured context, and evaluation loops are designed into the workflow instead of bolted on as chatbot theater.'
		},
		{
			icon: Layout,
			title: 'Beauty as clarity and trust',
			text: 'Visual design is used to reduce cognitive load, reveal uncertainty, and make complex work legible to researchers, users, and funders.'
		},
		{
			icon: ShieldCheck,
			title: 'Responsible by default',
			text: 'Privacy, provenance, reproducibility, maintainability, and human review are treated as product requirements, not compliance footnotes.'
		}
	];

	const workModes = [
		{
			name: 'Research Product Sprint',
			kicker: 'Shape the right thing before overbuilding it.',
			bestFor: 'Early-stage research ideas, grant demos, prototypes, and teams that need a clear product direction.',
			outcomes: [
				'Problem framing and audience map',
				'AI-native workflow architecture',
				'Clickable or working prototype',
				'Demo story and adoption hypothesis'
			]
		},
		{
			name: 'Applied Research Software Build',
			kicker: 'Turn complex research into software people can use.',
			bestFor: 'Scientific platforms, data tools, dashboards, validation systems, and expert interfaces.',
			outcomes: [
				'Production-minded SvelteKit/Python/data workflows',
				'UX and interaction design for expert users',
				'AI, ML, API, and visualization integrations',
				'Documentation, onboarding, and maintainability path'
			]
		},
		{
			name: 'Impact Story & Demo System',
			kicker: 'Make technical value obvious without dumbing it down.',
			bestFor: 'Research teams that need funders, partners, users, or stakeholders to understand why the work matters.',
			outcomes: [
				'Positioning and narrative',
				'Landing page, deck, or demo environment',
				'Before/after value story',
				'Reusable visual language for future communication'
			]
		}
	];

	const fitSignals = [
		'The code works, but the product value is hard to explain.',
		'The team wants AI leverage without vague AI magic or irresponsible automation.',
		'The workflow is knowledge-heavy, high-trust, and too specific for generic SaaS.',
		'The project needs a bridge between science, engineering, design, and adoption.'
	];

	const process = [
		['01', 'Frame', 'Clarify the domain, users, evidence, constraints, risks, and desired transformation.'],
		['02', 'Prototype', 'Build the smallest artifact that makes the future workflow tangible and testable.'],
		['03', 'Evaluate', 'Check usefulness, trust, AI failure modes, maintainability, and adoption signals.'],
		['04', 'Productize', 'Turn what works into a beautiful system, demo, narrative, and next-step roadmap.']
	];
</script>

<div class="min-h-screen overflow-hidden">
	<section class="animate-fade-in container mx-auto px-4 pb-12 pt-8 sm:pt-16 xl:pt-20">
		<div class="mx-auto max-w-6xl">
			<div class="badge badge-primary badge-outline mb-6 px-4 py-4 text-sm">
				CTW Studio · applied research software
			</div>

			<h1
				class="font-title glow-text-strong text-[3.5rem] font-bold leading-[0.86] tracking-tight sm:text-[5.6rem] lg:text-[8rem] xl:text-[10.4rem]"
			>
				Complex
				<span class="ctw-text-gradient block font-black">knowledge</span>
				beautiful
				<span class="ctw-text-gradient-green block font-black">systems</span>
			</h1>

			<div class="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
				<div>
					<p class="max-w-3xl text-xl leading-relaxed text-base-content/80 sm:text-2xl">
						I help research and expert teams turn complex knowledge work into AI-native software,
						workflows, demos, and product stories that people can understand, trust, and adopt.
					</p>
					<p class="mt-5 max-w-2xl text-base leading-relaxed text-base-content/60 sm:text-lg">
						Generic AI tools are becoming universal. The scarce layer is choosing the right
						problem, designing the workflow around real constraints, and making the result
						credible enough for serious work.
					</p>
					<div class="mt-8 flex flex-wrap gap-3">
						<a href="/contact" class="btn btn-primary btn-lg">Discuss a transformation</a>
						<a href="/work?category=Research+Project" class="btn btn-outline btn-lg">See research work</a>
					</div>
				</div>

				<div
					class="glass border-primary/20 from-base-100/60 to-base-300/40 rounded-box border bg-gradient-to-br p-6 shadow-2xl backdrop-blur"
				>
					<p class="mb-5 text-sm uppercase tracking-[0.28em] text-base-content/50">Transformation</p>
					<div class="space-y-4">
						{#each transformations as transformation}
							<div class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-sm sm:text-base">
								<div class="rounded-box bg-base-200/60 p-3 text-base-content/70">{transformation[0]}</div>
								<div class="text-primary">→</div>
								<div class="rounded-box border border-primary/20 bg-primary/10 p-3 font-semibold">
									{transformation[1]}
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl text-center">
				<div class="badge badge-secondary badge-outline mb-4">The edge</div>
				<h2 class="glow-text mb-6 text-4xl font-bold opacity-80">Not another AI automation shop.</h2>
				<p class="text-lg leading-relaxed text-base-content/70">
					CTW Studio sits between research, product design, software engineering, and AI workflow
					architecture. The goal is not to bolt a chatbot onto a project. The goal is to turn
					messy expert knowledge into systems that are useful, beautiful, evaluated, and maintainable.
				</p>
			</div>

			<div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
				{#each principles as principle}
					<div
						class="card glass border-primary/20 from-base-100/50 to-base-300/50 hover:border-secondary/30 border bg-gradient-to-br shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
					>
						<div class="card-body">
							<svelte:component this={principle.icon} class="mb-4 h-10 w-10 text-primary" />
							<h3 class="card-title text-xl">{principle.title}</h3>
							<p class="text-base-content/65">{principle.text}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
				<div>
					<div class="badge badge-primary badge-outline mb-4">Positioning</div>
					<h2 class="mb-5 text-4xl font-bold">Built for knowledge-heavy, high-trust domains.</h2>
					<p class="text-lg leading-relaxed text-base-content/70">
						Research software fails when the code works but the value is invisible, the interface
						is intimidating, or the AI behavior cannot be trusted. I help teams cross that gap.
					</p>
				</div>
				<div class="grid gap-4 sm:grid-cols-2">
					<div class="rounded-box border border-base-300/60 bg-base-200/30 p-6">
						<FlaskConical class="mb-4 h-8 w-8 text-primary" />
						<h3 class="mb-2 text-xl font-semibold">Research depth</h3>
						<p class="text-base-content/65">Scientific software, data systems, validation workflows, open science, and reproducible research contexts.</p>
					</div>
					<div class="rounded-box border border-base-300/60 bg-base-200/30 p-6">
						<Users class="mb-4 h-8 w-8 text-primary" />
						<h3 class="mb-2 text-xl font-semibold">Expert users</h3>
						<p class="text-base-content/65">Interfaces that respect expertise instead of hiding complexity behind vague AI magic.</p>
					</div>
					<div class="rounded-box border border-base-300/60 bg-base-200/30 p-6">
						<GitBranch class="mb-4 h-8 w-8 text-primary" />
						<h3 class="mb-2 text-xl font-semibold">Workflow architecture</h3>
						<p class="text-base-content/65">Context, tools, agents, evaluation, human review, and adoption designed as one system.</p>
					</div>
					<div class="rounded-box border border-base-300/60 bg-base-200/30 p-6">
						<Code2 class="mb-4 h-8 w-8 text-primary" />
						<h3 class="mb-2 text-xl font-semibold">Working artifacts</h3>
						<p class="text-base-content/65">Prototype, product, landing page, demo, dashboard, documentation, or roadmap — not strategy theater.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl text-center">
				<div class="badge badge-secondary badge-outline mb-4">Ways to work together</div>
				<h2 class="glow-text mb-6 text-4xl font-bold opacity-80">Engagements are shaped around outcomes, not packages.</h2>
				<p class="text-lg leading-relaxed text-base-content/70">
					A menu of fixed packages is the wrong abstraction for this work. A serious research transformation
					depends on domain complexity, risk, urgency, data access, and the artifact that needs to exist.
					These are the collaboration modes I usually shape from.
				</p>
			</div>

			<div class="mt-12 grid gap-6 lg:grid-cols-3">
				{#each workModes as mode}
					<div class="card glass border-primary/20 bg-base-100/50 shadow-xl backdrop-blur">
						<div class="card-body">
							<div class="mb-4 flex items-center gap-3">
								<Sparkles class="h-6 w-6 text-primary" />
								<h3 class="card-title text-2xl">{mode.name}</h3>
							</div>
							<p class="font-medium text-base-content/80">{mode.kicker}</p>
							<p class="mt-3 text-sm leading-relaxed text-base-content/60">Best for: {mode.bestFor}</p>
							<ul class="mt-5 space-y-3">
								{#each mode.outcomes as outcome}
									<li class="flex gap-3 text-sm text-base-content/70">
										<span class="mt-1 text-primary">●</span>
										<span>{outcome}</span>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="py-16">
		<div class="container mx-auto px-4">
			<div class="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
				<div>
					<div class="badge badge-primary badge-outline mb-4">Good fit</div>
					<h2 class="mb-5 text-4xl font-bold">The right projects have tension.</h2>
					<p class="text-lg leading-relaxed text-base-content/70">
						I am most useful when the work is technically real, strategically ambiguous, and too
						important to be left as a generic AI-generated interface.
					</p>
				</div>
				<div class="space-y-4">
					{#each fitSignals as signal}
						<div class="rounded-box border border-base-300/60 bg-base-200/30 p-5 text-base-content/75">
							<Compass class="mr-3 inline h-5 w-5 text-primary" />
							{signal}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<section class="py-16">
		<div class="container mx-auto px-4">
			<h2 class="glow-text mb-10 text-center text-4xl font-bold opacity-80">How a transformation moves</h2>
			<div class="grid gap-4 md:grid-cols-4">
				{#each process as step}
					<div class="rounded-box border border-primary/20 bg-primary/5 p-6">
						<div class="mb-6 text-sm font-bold uppercase tracking-[0.25em] text-primary/70">{step[0]}</div>
						<h3 class="mb-3 text-2xl font-semibold">{step[1]}</h3>
						<p class="text-sm leading-relaxed text-base-content/65">{step[2]}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="py-20">
		<div class="container mx-auto px-4">
			<div class="glass rounded-box border-primary/20 mx-auto max-w-5xl border bg-gradient-to-br from-primary/10 to-secondary/10 p-8 text-center shadow-2xl sm:p-12">
				<h2 class="glow-text-strong mb-6 text-4xl font-bold">Have complex research work that needs to become usable?</h2>
				<p class="mx-auto mb-8 max-w-2xl text-lg text-base-content/70">
					Bring the science, data, prototype, or messy workflow. I will help shape it into a
					beautiful, AI-aware product people can understand, evaluate, and trust.
				</p>
				<a href="/contact" class="btn btn-secondary btn-lg glass transition-transform duration-300 hover:scale-105">
					Start the conversation
				</a>
			</div>
		</div>
	</section>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	@keyframes glow-pulse {
		0%,
		100% {
			text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
		}
		50% {
			text-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
		}
	}

	.glow-text {
		text-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
	}

	.glow-text-strong {
		animation: glow-pulse 3s infinite;
		text-shadow: 0 0 8px rgba(255, 255, 255, 0.15);
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	.animate-fade-in {
		animation: fade-in 1s ease-out;
	}

	.ctw-text-gradient {
		background: -webkit-linear-gradient(110deg, #fdc343 51.57%, #e99877 67.46%, #fdc343 85.7%);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-shift 4s ease infinite;
	}

	.ctw-text-gradient-green {
		background: -webkit-linear-gradient(110deg, #5a877e 37.34%, #e99877 67.46%, #5a877e 97.46%);
		background-size: 200% auto;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: gradient-shift 4s ease infinite;
	}

	@keyframes gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
