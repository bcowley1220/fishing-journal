<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let form: any = {};
	let previewURL = '';
	let error = '';

	onMount(() => {
		const id = $page.params.id;
		const stored = localStorage.getItem('fishing-entries');
		const entries = stored ? JSON.parse(stored) : [];
		const found = entries.find((e: any) => e.id === id);
		if (found) {
			form = { ...found };
			previewURL = form.imageURL;
		} else {
			error = 'Entry not found';
		}
	});

	function handleSubmit() {
		const id = $page.params.id;
		const stored = localStorage.getItem('fishing-entries');
		let entries = stored ? JSON.parse(stored) : [];

		const index = entries.findIndex((e: any) => e.id === id);
		if (index !== -1) {
			entries[index] = form;
			localStorage.setItem('fishing-entries', JSON.stringify(entries));
			goto(`/entry/${id}`);
		}
	}
</script>

<section class="section">
	<div class="container">
		<h1 class="title">✏️ Edit Entry</h1>

		{#if error}
			<div class="notification is-danger">{error}</div>
		{:else}
			<form on:submit|preventDefault={handleSubmit}>
				<div class="field">
					<label class="label">Date</label>
					<div class="control">
						<input class="input" type="date" bind:value={form.date} required />
					</div>
				</div>

				<div class="field">
					<label class="label">Time</label>
					<div class="control">
						<input class="input" type="time" bind:value={form.time} required />
					</div>
				</div>

				<div class="field">
					<label class="label">Fisher Name</label>
					<div class="control">
						<input class="input" type="text" bind:value={form.fisher} />
					</div>
				</div>

				<div class="field">
					<label class="label">Fish Type</label>
					<input class="input" type="text" bind:value={form.fishType} />
				</div>

				<div class="field is-grouped">
					<div class="control is-expanded">
						<input class="input" type="number" step="0.1" placeholder="Length (inches)" bind:value={form.length} />
					</div>
					<div class="control is-expanded">
						<input class="input" type="number" step="0.1" placeholder="Weight (lbs)" bind:value={form.weight} />
					</div>
				</div>

				<div class="field">
					<label class="label">Lure Used</label>
					<input class="input" type="text" bind:value={form.lure} />
				</div>

				<div class="field">
					<label class="label">Notes</label>
					<textarea class="textarea" bind:value={form.notes}></textarea>
				</div>

				<div class="field">
					<label class="label">Image URL</label>
					<input class="input" type="text" bind:value={form.imageURL} />
				</div>

				{#if form.imageURL}
					<figure class="image is-3by2 mt-3">
						<img src={form.imageURL} alt="Preview" />
					</figure>
				{/if}

				<div class="field">
					<label class="label">Latitude</label>
					<input class="input" type="text" bind:value={form.lat} />
				</div>

				<div class="field">
					<label class="label">Longitude</label>
					<input class="input" type="text" bind:value={form.lng} />
				</div>

				<div class="field mt-4 is-grouped">
					<div class="control">
						<button type="submit" class="button is-primary">Save Changes</button>
					</div>
					<div class="control">
						<a class="button is-light" href={`/entry/${form.id}`}>Cancel</a>
					</div>
				</div>
			</form>
		{/if}
	</div>
</section>
