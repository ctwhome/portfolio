<script lang="ts">
	// const  { user, isLoggedIn } = useAuth()
	import LoginForm from './LoginForm.svelte';

	export let user: any = false;
</script>

<div>
	<!-- Logged in -->
	<!--    v-if="isLoggedIn()" -->
	{#if user}
		<a
			href="/profile"
			class="hover:bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center"
		>
			<img
				draggable="false"
				class="cursor-pointer h-8 w-8 rounded-full"
				src={(user && user.user_metadata && user.user_metadata.avatar_url) || '/img/avatar.svg'}
				referrerpolicy="no-referrer"
			/>
		</a>
		<!-- Not logged in-->
	{:else}
		<div>
			<div>
				<label for="login-modal" class="btn btn-primary btn-md modal-button">Login access</label>
				<input id="login-modal" type="checkbox" class="modal-toggle" />
				<div class="modal h-screen">
					<div class="modal-box">
						<LoginForm />

						<div class="modal-action">
							<label for="login-modal" class="btn">Close</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
