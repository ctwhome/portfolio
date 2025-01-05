<script lang="ts">
	import { onMount } from 'svelte';
	import toast from 'svelte-french-toast';

	export let showButton = true;
	export let userInfo: {
		id?: string;
		name?: string;
		email?: string;
		photoURL?: string;
	} | null = null;

	let textarea: HTMLTextAreaElement;
	let modal: HTMLDialogElement;
	let isModalOpen = false;

	onMount(() => {
		modal = document.getElementById('feedback_modal') as HTMLDialogElement;
	});

	function closeModal() {
		modal.close();
		isModalOpen = false;
		textarea.value = ''; // Clear the feedback input
	}

	function openModal() {
		modal.showModal();
		isModalOpen = true;
	}

	function parseUserAgent(userAgent: string) {
		// Browser detection
		let browser = 'Unknown';
		if (userAgent.includes('Firefox')) {
			browser = 'Firefox';
		} else if (userAgent.includes('Chrome')) {
			browser = 'Chrome';
		} else if (userAgent.includes('Safari')) {
			browser = 'Safari';
		} else if (userAgent.includes('Edge')) {
			browser = 'Edge';
		} else if (userAgent.includes('Opera')) {
			browser = 'Opera';
		}

		// OS detection
		let os = 'Unknown';
		if (userAgent.includes('Windows')) {
			os = 'Windows';
		} else if (userAgent.includes('Mac OS')) {
			os = 'macOS';
		} else if (userAgent.includes('Linux')) {
			os = 'Linux';
		} else if (userAgent.includes('Android')) {
			os = 'Android';
		} else if (userAgent.includes('iOS')) {
			os = 'iOS';
		}

		return { browser, os };
	}

	function getBrowserInfo() {
		const { browser, os } = parseUserAgent(navigator.userAgent);
		return {
			browser,
			os,
			language: navigator.language,
			screenWidth: window.screen.width,
			screenHeight: window.screen.height
		};
	}

	async function sendFeedback() {
		const feedback = textarea.value;
		if (!feedback.trim()) {
			toast.error('Please enter your feedback');
			return;
		}

		const browserInfo = getBrowserInfo();
		const currentUrl = window.location.href;

		const emailContent = `
			<html>
				<body>

					<h3>Feedback from (${currentUrl})</h3>
					<p style="font-size:18px; padding: 16px; background-color: #dedede">${feedback.replace(/\n/g, '<br>')}</p>

					${
						userInfo
							? `
					<h4>User Information:</h4>
					<ul>
						<li><strong>User ID:</strong> ${userInfo.id}</li>
						<li><strong>Name:</strong> ${userInfo.name}</li>
						<li><strong>Email:</strong> ${userInfo.email}</li>
						${userInfo.photoURL ? `<li><strong>Profile Photo:</strong> <img src="${userInfo.photoURL}" alt="User profile" style="width: 50px; height: 50px; border-radius: 25px;">` : ''}
					</ul>
					`
							: '<p>User not logged in</p>'
					}

					<h3>Browser Information:</h3>
					<ul>
						<li><strong>Browser:</strong> ${browserInfo.browser}</li>
						<li><strong>Operating System:</strong> ${browserInfo.os}</li>
						<li><strong>Language:</strong> ${browserInfo.language}</li>
						<li><strong>Screen Size:</strong> ${browserInfo.screenWidth}x${browserInfo.screenHeight}</li>
					</ul>

				</body>
			</html>
		`;

		const loadingToast = toast.loading('Sending feedback...');

		try {
			const response = await fetch('/api/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ emailContent })
			});

			const result = await response.json();

			if (result.success) {
				toast.success('Feedback sent successfully', {
					id: loadingToast
				});
				closeModal();
			} else {
				throw new Error(result.message);
			}
		} catch (error) {
			console.error('Error sending feedback:', error);
			toast.error('Failed to send feedback. Please try again later.', {
				id: loadingToast
			});
		}
	}
</script>

{#if showButton}
	<button
		class="btn btn-sm"
		class:btn-ghost={!isModalOpen}
		class:btn-secondary={isModalOpen}
		on:click={openModal}
	>
		Feedback
	</button>
{/if}

<dialog id="feedback_modal" class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Feedback</h3>
		<textarea
			bind:this={textarea}
			class="textarea mt-10 w-full"
			name="feedback"
			id="feedback"
			placeholder="Write your feedback here"
			rows="6"
		></textarea>
		<div class="modal-action justify-between">
			<button class="btn" on:click={closeModal}>Cancel</button>
			<button class="btn btn-primary" on:click={sendFeedback}>Send Feedback</button>
		</div>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button on:click={closeModal}>Cancel</button>
	</form>
</dialog>
