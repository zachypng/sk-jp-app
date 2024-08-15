<script lang="ts">
	import Autofill from './Autofill.svelte';
	import NamePopup from './NamePopup.svelte';
	import Forms from './Forms.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: reloadForms = false;
</script>

<svelte:head>
	<title>JP App - Data Input</title>
	<meta name="description" content="JP Data Team Webapp" />
	<meta name="robots" content="noindex" />
</svelte:head>

<NamePopup user={data.user} />

<div class="mx-auto grid w-full max-w-[100rem]">
	<main class="col-span-4 gap-4 md:gap-8">
		<Forms user={data.user} bind:reloadForms />
		<Autofill streamed={data.streamed} bind:reloadForms />
	</main>
</div>
