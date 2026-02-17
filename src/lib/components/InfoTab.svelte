<script lang="ts">
	import { paragraphify } from '$lib/utils';
	import { Flag, FlagOff, MinusCircle, PlusCircle } from 'lucide-svelte';
	import type { ATCompany, ATMove } from '$lib/config';

	export let companyData: ATCompany;
	export let moveData: { keyHires: ATMove[]; keyDepartures: ATMove[]; general: ATMove[] };
</script>

<div class="sticky top-0 z-10 h-32 w-full border-b bg-background">
	<div class="px-6 py-4">
		<h3 class="text-md my-4 scroll-m-20 font-black tracking-tight">
			AUM: <span class="ml-2 text-base font-normal">{companyData['AUM_Concatenate'] || 'N/A'}</span>
		</h3>
		<h3 class="text-md my-4 scroll-m-20 font-black tracking-tight">
			{#if companyData.firmType}
				Firm Type: <span class="ml-2 text-base font-normal">{companyData.firmType}</span>
			{/if}
		</h3>
	</div>
</div>
{#if moveData.keyHires.length > 0}
	<div class="sticky top-32 w-full border-b bg-muted py-2 pl-6">
		<h3 class="text-md my-4 scroll-m-20 font-black tracking-tight">Key Hires:</h3>
	</div>
	{#each moveData.keyHires as keyHire}
		<div class="flex items-center px-6 py-3">
			<div class="mr-4 h-full">
				<Flag class="h-6 w-6" />
			</div>
			<p class="text-sm">{@html paragraphify(keyHire)}</p>
		</div>
	{/each}
{/if}
{#if moveData.keyDepartures.length > 0}
	<div class="sticky top-32 w-full border-y bg-muted py-2 pl-6">
		<h3 class="text-md my-4 scroll-m-20 font-black tracking-tight">Key Departures:</h3>
	</div>
	{#each moveData.keyDepartures as keyDeparture}
		<div class="flex items-center px-6 py-3">
			<div class="mr-4 h-full">
				<FlagOff class="h-6 w-6" />
			</div>
			<p class="text-sm">{@html paragraphify(keyDeparture)}</p>
		</div>
	{/each}
{/if}
{#if moveData.general.length > 0}
	<div class="sticky top-32 w-full border-y bg-muted py-2 pl-6">
		<h3 class="text-md my-4 scroll-m-20 font-black tracking-tight">Hires / Departures:</h3>
	</div>
	{#each moveData.general as move}
		{#if move.moveType === 'Hire' && paragraphify(move) !== 'hidden'}
			<div class="flex items-center px-6 py-3">
				<div class="mr-4 h-full">
					<PlusCircle class="h-6 w-6" />
				</div>
				<p class="text-sm">{@html paragraphify(move)}</p>
			</div>
		{:else if move.moveType === 'Departure' && paragraphify(move) !== 'hidden'}
			<div class="flex items-center px-6 py-3">
				<div class="mr-4 h-full">
					<MinusCircle class="h-6 w-6" />
				</div>
				<p class="text-sm">{@html paragraphify(move)}</p>
			</div>
		{:else}
			<div class="hidden items-center py-3"></div>
		{/if}
	{/each}
{/if}
