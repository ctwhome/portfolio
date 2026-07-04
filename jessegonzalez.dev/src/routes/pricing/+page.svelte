<script lang="ts">
	import Code2 from '~icons/lucide/code-2';
	import Layout from '~icons/lucide/layout';
	import Target from '~icons/lucide/target';
	import Briefcase from '~icons/lucide/briefcase';
	import Wallet from '~icons/lucide/wallet';
	import Users from '~icons/lucide/users';
	import Brain from '~icons/lucide/brain';
	import Workflow from '~icons/lucide/git-branch';
</script>

<div class="min-h-screen">
	<!-- Hero Section -->
	<div class="animate-fade-in container mx-auto -mt-2 px-4 sm:mt-16 xl:mt-20">
		<h1
			class="font-title glow-text-strong
			text-center text-[3.5rem] font-bold
			leading-[2.5rem]
						 transition-transform duration-700
						 sm:text-[6rem] sm:leading-[3.8rem]
						 lg:text-[9rem] lg:leading-[6rem]
						 xl:text-[12rem] xl:leading-[8rem]
						 2xl:text-[15rem] 2xl:leading-[10rem]"
		>
			Smart
			<br />
			<span class="ctw-text-gradient font-black">Engineering</span>
			<br />
			Intuitive
			<br />
			<span class="ctw-text-gradient-green font-black">Design</span>
		</h1>
		<div class="mt-12 text-center text-xl opacity-80 sm:mt-20 sm:text-2xl">
			Powered by AI and modern engineering practices, we can deliver cutting-edge digital solutions
			together.
			<div class="my-3"></div>
			Get enterprise innovation with boutique-level attention.
		</div>
		<div class="mt-8 text-center">
			<a href="#compare" class="btn btn-primary btn-lg">See the Difference</a>
		</div>
	</div>

	<!-- Why Choose Me Section -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<h2 class="glow-text mb-16 text-center text-4xl font-bold opacity-60">Why Choose Me?</h2>
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
				<div
					class="card glass border-primary/20 from-base-100/50 to-base-300/50 hover:border-secondary/20 border bg-gradient-to-br shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
				>
					<div class="card-body">
						<Briefcase class="mb-4 h-12 w-12" />
						<h3 class="card-title">15 Years Experience</h3>
						<p>
							Extensive experience in delivering successful digital products across various
							industries.
						</p>
					</div>
				</div>
				<div
					class="card glass border-primary/20 from-base-100/50 to-base-300/50 hover:border-secondary/20 border bg-gradient-to-br shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
				>
					<div class="card-body">
						<Wallet class="mb-4 h-12 w-12" />
						<h3 class="card-title">Cost Effective</h3>
						<p>Lower overhead means better rates without compromising on quality.</p>
					</div>
				</div>
				<div
					class="card glass border-primary/20 from-base-100/50 to-base-300/50 hover:border-secondary/20 border bg-gradient-to-br shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
				>
					<div class="card-body">
						<Users class="mb-4 h-12 w-12" />
						<h3 class="card-title">Direct Communication</h3>
						<p>Work directly with the developer, no account managers or middlemen.</p>
					</div>
				</div>
				<div
					class="card glass border-primary/20 from-base-100/50 to-base-300/50 hover:border-secondary/20 border bg-gradient-to-br shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
				>
					<div class="card-body">
						<Brain class="mb-4 h-12 w-12" />
						<h3 class="card-title">AI & Research Background</h3>
						<p>
							Masters in AI and extensive research in human-computer interaction to deliver smarter
							solutions.
						</p>
					</div>
				</div>
				<div
					class="card glass border-primary/20 from-base-100/50 to-base-300/50 hover:border-secondary/20 border bg-gradient-to-br shadow-xl backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
				>
					<div class="card-body">
						<Workflow class="mb-4 h-12 w-12" />
						<h3 class="card-title">Proven Methodology</h3>
						<p>
							Design Thinking and Agile Kanban processes ensure efficient, user-centered
							development.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Comprehensive Service Pricing -->
	<section id="compare" class="mt-20 py-20">
		<div class="container mx-auto px-4">
			<h2 class="glow-text mb-16 text-center text-4xl font-bold opacity-60">Service Pricing</h2>
			<div class="overflow-x-auto">
				<div
					class="glass rounded-box border-primary/20 from-base-100/50 to-base-300/50 mx-auto max-w-4xl border bg-gradient-to-br p-8 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-2xl"
				>
					<table
						class="[&_tr:hover]:bg-primary/5 table w-full [&_tr]:transition-colors [&_tr]:duration-200"
					>
						<thead>
							<tr>
								<th class="text-lg font-bold">Service</th>
								<th class="text-primary text-lg font-bold">My Price</th>
								<th class="text-secondary text-lg font-bold">Agency Average</th>
							</tr>
						</thead>
						<tbody>
							<!-- Brand & Identity -->
							<tr class="border-primary/20 border-t-2">
								<td colspan="3" class="bg-base-200/50 font-bold">Brand & Identity</td>
							</tr>
							<tr>
								<td>Brand Strategy Development</td>
								<td class="text-primary font-semibold">€5,000+</td>
								<td class="text-secondary font-semibold">€10,000+</td>
							</tr>
							<tr>
								<td>Logo Design & Guidelines</td>
								<td class="text-primary font-semibold">€2,500+</td>
								<td class="text-secondary font-semibold">€5,000+</td>
							</tr>
							<tr>
								<td>Visual Identity System</td>
								<td class="text-primary font-semibold">€3,500+</td>
								<td class="text-secondary font-semibold">€7,000+</td>
							</tr>
							<tr>
								<td>Brand Voice & Messaging</td>
								<td class="text-primary font-semibold">€2,000+</td>
								<td class="text-secondary font-semibold">€4,000+</td>
							</tr>

							<!-- Design -->
							<tr class="border-primary/20 border-t-2">
								<td colspan="3" class="bg-base-200/50 font-bold">Design Services</td>
							</tr>
							<tr>
								<td>UX Research & Analysis</td>
								<td class="text-primary font-semibold">€4,000+</td>
								<td class="text-secondary font-semibold">€8,000+</td>
							</tr>
							<tr>
								<td>UI Design (per platform)</td>
								<td class="text-primary font-semibold">€6,000+</td>
								<td class="text-secondary font-semibold">€12,000+</td>
							</tr>
							<tr>
								<td>Marketing Materials Design</td>
								<td class="text-primary font-semibold">€2,500+</td>
								<td class="text-secondary font-semibold">€5,000+</td>
							</tr>
							<tr>
								<td>Motion Graphics & Animation</td>
								<td class="text-primary font-semibold">€4,500+</td>
								<td class="text-secondary font-semibold">€9,000+</td>
							</tr>

							<!-- Development -->
							<tr class="border-primary/20 border-t-2">
								<td colspan="3" class="bg-base-200/50 font-bold">Development</td>
							</tr>
							<tr>
								<td>MVP Development</td>
								<td class="text-primary font-semibold">€30,000+</td>
								<td class="text-secondary font-semibold">€50,000+</td>
							</tr>
							<tr>
								<td>Full Web Application</td>
								<td class="text-primary font-semibold">€60,000+</td>
								<td class="text-secondary font-semibold">€100,000+</td>
							</tr>
							<tr>
								<td>Mobile App Development</td>
								<td class="text-primary font-semibold">€40,000+</td>
								<td class="text-secondary font-semibold">€80,000+</td>
							</tr>
							<tr>
								<td>Custom Software Development</td>
								<td class="text-primary font-semibold">€45,000+</td>
								<td class="text-secondary font-semibold">€90,000+</td>
							</tr>

							<!-- E-commerce -->
							<tr class="border-primary/20 border-t-2">
								<td colspan="3" class="bg-base-200/50 font-bold">E-commerce Solutions</td>
							</tr>
							<tr>
								<td>E-commerce Website</td>
								<td class="text-primary font-semibold">€15,000+</td>
								<td class="text-secondary font-semibold">€30,000+</td>
							</tr>
							<tr>
								<td>Custom Marketplace</td>
								<td class="text-primary font-semibold">€50,000+</td>
								<td class="text-secondary font-semibold">€100,000+</td>
							</tr>
							<tr>
								<td>Payment Integration</td>
								<td class="text-primary font-semibold">€3,000+</td>
								<td class="text-secondary font-semibold">€6,000+</td>
							</tr>
							<tr>
								<td>Inventory Management System</td>
								<td class="text-primary font-semibold">€8,000+</td>
								<td class="text-secondary font-semibold">€16,000+</td>
							</tr>

							<!-- Digital Marketing -->
							<tr class="border-primary/20 border-t-2">
								<td colspan="3" class="bg-base-200/50 font-bold">Digital Marketing</td>
							</tr>
							<tr>
								<td>SEO Setup & Strategy</td>
								<td class="text-primary font-semibold">€2,500+</td>
								<td class="text-secondary font-semibold">€5,000+</td>
							</tr>
							<tr>
								<td>Marketing Campaign Setup</td>
								<td class="text-primary font-semibold">€3,000+</td>
								<td class="text-secondary font-semibold">€6,000+</td>
							</tr>
							<tr>
								<td>Social Media Marketing</td>
								<td class="text-primary font-semibold">€2,000+</td>
								<td class="text-secondary font-semibold">€4,000+</td>
							</tr>
							<tr>
								<td>Content Strategy & Creation</td>
								<td class="text-primary font-semibold">€2,500+</td>
								<td class="text-secondary font-semibold">€5,000+</td>
							</tr>

							<!-- Emerging Tech -->
							<tr class="border-primary/20 border-t-2">
								<td colspan="3" class="bg-base-200/50 font-bold">Emerging Technologies</td>
							</tr>
							<tr>
								<td>AR/VR Development</td>
								<td class="text-primary font-semibold">€20,000+</td>
								<td class="text-secondary font-semibold">€40,000+</td>
							</tr>
							<tr>
								<td>AI Implementation</td>
								<td class="text-primary font-semibold">€15,000+</td>
								<td class="text-secondary font-semibold">€30,000+</td>
							</tr>
							<tr>
								<td>Blockchain Solutions</td>
								<td class="text-primary font-semibold">€25,000+</td>
								<td class="text-secondary font-semibold">€50,000+</td>
							</tr>
							<tr>
								<td>IoT Integration</td>
								<td class="text-primary font-semibold">€18,000+</td>
								<td class="text-secondary font-semibold">€36,000+</td>
							</tr>

							<!-- Support & Maintenance -->
							<tr class="border-primary/20 border-t-2">
								<td colspan="3" class="bg-base-200/50 font-bold">Support & Maintenance</td>
							</tr>
							<tr>
								<td>Monthly Maintenance</td>
								<td class="text-primary font-semibold">€2,000+</td>
								<td class="text-secondary font-semibold">€4,000+</td>
							</tr>
							<tr>
								<td>Monthly Retainer (Full Service)</td>
								<td class="text-primary font-semibold">€5,000+</td>
								<td class="text-secondary font-semibold">€10,000+</td>
							</tr>
							<tr>
								<td>Technical Support (per month)</td>
								<td class="text-primary font-semibold">€1,500+</td>
								<td class="text-secondary font-semibold">€3,000+</td>
							</tr>
							<tr>
								<td>Security Audits & Updates</td>
								<td class="text-primary font-semibold">€3,000+</td>
								<td class="text-secondary font-semibold">€6,000+</td>
							</tr>

							<!-- Consultation -->
							<tr class="border-primary/20 border-t-2">
								<td colspan="3" class="bg-base-200/50 font-bold">Consultation & Strategy</td>
							</tr>
							<tr>
								<td>Technical Consultation (per day)</td>
								<td class="text-primary font-semibold">€800</td>
								<td class="text-secondary font-semibold">€1,600</td>
							</tr>
							<tr>
								<td>Project Planning & Strategy</td>
								<td class="text-primary font-semibold">€3,000+</td>
								<td class="text-secondary font-semibold">€6,000+</td>
							</tr>
							<tr>
								<td>Digital Transformation Strategy</td>
								<td class="text-primary font-semibold">€10,000+</td>
								<td class="text-secondary font-semibold">€20,000+</td>
							</tr>
							<tr>
								<td>Technology Stack Consulting</td>
								<td class="text-primary font-semibold">€5,000+</td>
								<td class="text-secondary font-semibold">€10,000+</td>
							</tr>
						</tbody>
					</table>
					<p class="mt-6 text-center text-sm">
						* Prices are estimates and may vary based on project requirements. Contact for detailed
						quotes.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="py-20">
		<div class="container mx-auto px-4 text-center">
			<h2 class="glow-text-strong mb-8 text-4xl font-bold">Ready to Start Your Project?</h2>
			<p class="mb-8 text-xl">
				Get AI-powered engineering excellence with personalized attention. Let's innovate together.
			</p>
			<a
				href="/contact"
				class="btn btn-secondary btn-lg glass transition-transform duration-300 hover:scale-105"
			>
				Contact Me
			</a>
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

	.glow-text:hover {
		text-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
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
