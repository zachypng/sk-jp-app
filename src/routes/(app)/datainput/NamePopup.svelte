<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import HoldHorses from '$lib/images/holdHorses.svelte';
	import type { PageData } from './$types';
	export let user: PageData['user'];
	let open = user.name ? false : true;
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Hold your horses, partner!</Dialog.Title>
			<Dialog.Description>
				<div class="m-4 mx-auto h-24 w-24">
					<HoldHorses />
				</div>
				You should<span class="animate-pulse font-bold text-warning">&nbsp;update your name</span> in
				settings so the data input forms auto-fill your name into respective fields! You can choose to
				ignore this, but your life will forever be difficult and I will not stop pestering everytime
				you open this page...
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				variant="outline"
				class="border-destructive transition-all hover:scale-105 hover:bg-destructive/20"
				on:click={() => (open = false)}>I choose to suffer</Button
			>
			<Button href="/settings" class="transition-all hover:scale-105">Take me there!</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
