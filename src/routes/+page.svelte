<script>
	import { account } from '$lib/appwrite';
	import { onMount } from 'svelte';

	let user = '';
	let session = '';
	let token = '';

	let state = ['notLoggedIn', 'tokenGenerated', 'loggedIn'];
	let currentState = state[0];

	async function createToken(event) {
		try {
			event.preventDefault();

			let formData = new FormData(event.target);
			const email = formData.get('email');
			const password = formData.get('password');

			let authRequest = await fetch('/auth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			let authRequestBody = await authRequest.json();

			user = authRequestBody.user;
			token = authRequestBody.token;
			currentState = state[1];
		} catch (error) {
			console.error(error);
		}
	}

	async function createSession() {
		session = await account.createSession(user.$id, token.secret);
		currentState = state[2];
	}

	async function logout() {
		token = '';
		session = '';
		currentState = state[0];
		await account.deleteSession('current');
	}

	onMount(async () => {
		await logout();
	});
</script>

<div class="heading">
	<img class="u-margin-block-end-16" src="/logotype.svg" alt="Appwrite logotype" />
	<h1 class="heading-level-2">Custom Token Auth Demo</h1>
</div>

{#if currentState == state[0]}
	<div class="notLoggedIn container">
		<h2 class="heading-level-3">Login</h2>
		<form on:submit={createToken}>
			<div class="inputCard">
				<label for="email">Email</label>
				<input type="email" id="email" name="email" placeholder="Enter any email id" required />
			</div>
			<div class="inputCard">
				<label for="password">Password (Enter code: 123456)</label>
				<input type="text" id="password" name="password" placeholder="123456" required />
			</div>
			<button class="button" type="submit">Login</button>
		</form>
	</div>
{:else if currentState == state[1]}
	<div class="tokenGenerated container">
		<h2 class="heading-level-3">Token secret: {token.secret}</h2>
		<button class="button" on:click={createSession}>Generate session</button>
	</div>
{:else if currentState == state[2]}
	<div class="loggedIn container">
		<h2 class="heading-level-3">Session details</h2>
		<pre>{JSON.stringify(session, undefined, 4)}</pre>
		<button class="button" type="submit" on:click={logout}>Logout</button>
	</div>
{/if}

<style>
	.heading {
		margin: 2.5rem;
	}

	h1 {
		color: hsl(var(--color-neutral-5));
	}

	h2 {
		color: hsl(var(--color-neutral-5));
		margin-bottom: 2rem;
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin: 2rem;
		padding: 3rem;
		gap: 1rem;
		background-color: hsl(var(--color-neutral-85));
		border: 5px solid hsl(var(--color-neutral-80));
		border-radius: 20px;
		color: hsl(var(--color-neutral-0));
		width: 35%;
	}

	form {
		gap: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.inputCard {
		gap: 0.5rem;
	}

	label {
		font-size: 1rem;
	}

	input {
		font-size: 1rem;
		padding: 0.5rem;
	}

	.loggedIn {
		gap: 1rem;
	}

	pre {
		padding: 0.5rem 1rem;
		border: 2px solid hsl(var(--color-primary-100));
		border-radius: 0.5rem;
		white-space: pre-line;
		max-width: 70vw;
		text-align: left;
	}

	@media (max-width: 767.99px) {
		.container {
			width: 90%;
		}
	}
</style>
