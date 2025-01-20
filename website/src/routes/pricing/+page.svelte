<script lang="ts">
	import Code2 from '~icons/lucide/code-2';
	import Layout from '~icons/lucide/layout';
	import Target from '~icons/lucide/target';
	import Briefcase from '~icons/lucide/briefcase';
	import Wallet from '~icons/lucide/wallet';
	import Users from '~icons/lucide/users';
</script>

<div class="from-base-300 via-base-200 to-base-100 min-h-screen bg-gradient-to-b">
	<!-- Hero Section -->
	<section class="hero min-h-[60vh] bg-gradient-to-r backdrop-blur">
		<div class="hero-content text-center">
			<div class="max-w-3xl">
				<h1
					class="from-primary to-secondary animate-gradient mb-8 bg-gradient-to-r bg-clip-text text-5xl font-bold text-transparent"
				>
					Enterprise Quality, Boutique Pricing
				</h1>
				<p class="mb-8 text-xl">
					With 15 years of experience delivering full-stack applications from concept to production,
					I offer the same quality as large agencies but without the overhead costs. Get
					enterprise-grade solutions at boutique prices.
				</p>
				<a href="#compare" class="btn btn-primary btn-lg">See the Difference</a>
			</div>
		</div>
	</section>

	<!-- Comprehensive Service Pricing -->
	<section
		id="compare"
		class="from-primary/5 via-secondary/5 to-accent/5 mt-20 bg-gradient-to-r py-20"
	>
		<div class="container mx-auto px-4">
			<h2
				class="from-primary to-secondary mb-16 bg-gradient-to-r bg-clip-text text-center text-4xl font-bold text-transparent"
			>
				Service Pricing
			</h2>
			<div class="overflow-x-auto">
				<div
					class="glass rounded-box border-primary/20 from-base-100/50 to-base-300/50 mx-auto max-w-4xl border bg-gradient-to-br p-8 shadow-lg backdrop-blur transition-all duration-300 hover:shadow-2xl"
				>
					<table
						class="[&_tr:hover]:bg-primary/5 table w-full [&_tr]:transition-colors [&_tr]:duration-200"
					>
						<thead class="from-primary/20 to-secondary/20 bg-gradient-to-r">
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

	<!-- Why Choose Me Section -->
	<section class="from-base-200 to-base-300 bg-gradient-to-b py-20">
		<div class="container mx-auto px-4">
			<h2
				class="from-primary to-secondary mb-16 bg-gradient-to-r bg-clip-text text-center text-4xl font-bold text-transparent"
			>
				Why Choose Me?
			</h2>
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
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="from-primary via-secondary to-accent text-primary-content bg-gradient-to-r py-20">
		<div
			class="glass rounded-box border-primary/20 from-base-100/50 to-base-300/50 container mx-auto border bg-gradient-to-br p-12 px-4 text-center backdrop-blur"
		>
			<h2 class="mb-8 animate-pulse text-4xl font-bold">Ready to Start Your Project?</h2>
			<p class="mb-8 text-xl">
				Get enterprise quality at boutique prices. Let's discuss your project today.
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
