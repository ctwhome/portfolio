<script>
	import { signOut } from '@auth/sveltekit/client';
</script>

<button
	onclick={() => signOut({ callbackUrl: '/' })}
	class="cursor-pointer mt-5 border-2 border-content rounded-lg font-bold text-content px-2 py-2 transition duration-200 ease-in-out hover:bg-base-300 hover:text-white mr-6"
>
	LOG OUT
</button>
