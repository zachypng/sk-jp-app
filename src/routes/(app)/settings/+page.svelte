<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	import { Input } from '$lib/components/ui/input';

	import { Check, Loader2, TestTubeDiagonal } from 'lucide-svelte';
	import NameForm from './nameForm.svelte';
	import { toast } from 'svelte-sonner';
	import { fly } from 'svelte/transition';

	export let data;

	let loading = false;
	let loading2 = false;
</script>

<svelte:head>
	<title>JP App - Settings</title>
	<meta name="description" content="JP Data Team Webapp" />
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="flex w-full flex-col">
	<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
		<div in:fly={{ x: 0, y: 200, duration: 1000, delay: 0 }}>
			<Card.Root class="max-w-3xl">
				<Card.Header class="">
					<Card.Title>Name</Card.Title>
					<Card.Description
						>Select your name from the dropdown so Airtable knows what to autofill in the datainput
						forms!</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<NameForm data={data.form} namesList={data.names} />
				</Card.Content>
			</Card.Root>
		</div>

		<div in:fly={{ x: 0, y: 200, duration: 1000, delay: 100 }}>
			<Card.Root class="max-w-3xl">
				<Card.Header class="">
					<Card.Title>Nickname</Card.Title>
					<Card.Description
						>Not super important, so feel free to set it to anything you want. It will be used by
						this app to address you and takes priority over your name/email from Airtable😄</Card.Description
					>
				</Card.Header>
				<Card.Content class="">
					<form
						method="post"
						action="?/updateNickname"
						id="updateNickname"
						name="nickname"
						use:enhance={() => {
							loading = true;
							return async ({ update }) => {
								await update();
								toast.success('Nickname successfully updated!');
								setTimeout(() => {
									loading = false;
								}, 1000);
							};
						}}
					>
						<Input
							placeholder={data.user.nickname ? data.user.nickname : 'Enter your nickname...'}
							class="max-w-md"
							name="nickname"
						/>
					</form>
				</Card.Content>
				<Card.Footer>
					<Button type="submit" form="updateNickname" disabled={loading}
						>{#if loading}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}Update</Button
					>
				</Card.Footer>
			</Card.Root>
		</div>
		<div in:fly={{ x: 100, y: 200, duration: 1000, delay: 200 }}>
			<Card.Root class="max-w-3xl">
				<Card.Header>
					<Card.Title>Beta Enrollment</Card.Title>
					<Card.Description
						>Click the button below to enroll in beta testing new features for the app.</Card.Description
					>
				</Card.Header>
				<Card.Content>
					<form
						method="post"
						action="?/betaEnroll"
						id="betaEnroll"
						use:enhance={() => {
							loading2 = true;
							return async ({ update }) => {
								await update();
								toast.success('Enrolled in beta testing!');
								setTimeout(() => {
									loading2 = false;
								}, 1000);
							};
						}}
					>
						{#if data.user.isBetaEnrolled == 1}
							<Button disabled><Check class="mr-2 h-4 w-4" />Already Enrolled</Button>
						{:else}
							<Button type="submit" form="betaEnroll" disabled={loading2}
								>{#if loading2}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{:else}<TestTubeDiagonal
										class="mr-2 h-4 w-4"
									/>{/if}Enroll</Button
							>
						{/if}
					</form>
				</Card.Content>
				<Card.Footer></Card.Footer>
			</Card.Root>
		</div>
	</main>
</div>
