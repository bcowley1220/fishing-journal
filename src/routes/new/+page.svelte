<script lang="ts">
	import { onMount } from 'svelte';
    import {goto} from '$app/navigation';

	let form = {
		date: '',
		time: '',
		fisher: '',
		fishType: '',
		length: '',
		weight: '',
		lure: '',
		notes: '',
		imageURL: '',
		lat: '',
		lng: ''
	};

	let error = '';
	let previewURL = '';

	// 📍 Get GPS coordinates
	async function getLocation() {
		if (!navigator.geolocation) {
			error = 'Geolocation not supported.';
			return;
		}
		navigator.geolocation.getCurrentPosition(
			(pos) => {
				form.lat = pos.coords.latitude.toFixed(6);
				form.lng = pos.coords.longitude.toFixed(6);
			},
			(err) => {
				error = 'Unable to retrieve location.';
			}
		);
	}

	// 📷 File System Access API + fallback
	async function handleFilePick() {
		try {
			const [fileHandle] = await (window as any).showOpenFilePicker({
				types: [{ description: 'Images', accept: { 'image/*': ['.png', '.jpg', '.jpeg'] } }],
				excludeAcceptAllOption: true,
				multiple: false
			});
			const file = await fileHandle.getFile();
			previewURL = URL.createObjectURL(file);
			form.imageURL = previewURL;
		} catch (err) {
			error = 'File selection cancelled or unsupported.';
		}
	}

	function handleSubmit() {
		const entry = { ...form, id: crypto.randomUUID() };
		const stored = localStorage.getItem('fishing-entries');
		const entries = stored ? JSON.parse(stored) : [];
		entries.push(entry);
		localStorage.setItem('fishing-entries', JSON.stringify(entries));
		alert('Entry saved!');
        goto('/'); // Redirect to main page after saving
	}
</script>

<section class="section">
	<div class="container">
		<h1 class="title">🎣 New Fishing Entry</h1>

		{#if error}
			<div class="notification is-danger">{error}</div>
		{/if}

		<div class="box">
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
					<label class="label">Photo</label>
					<div class="control">
						<button type="button" class="button is-link" on:click={handleFilePick}>
							Select Image
						</button>
					</div>
					{#if previewURL}
						<figure class="image mt-3" style="max-width: 300px;">
							<img src={previewURL} alt="Preview" />
						</figure>
					{/if}
				</div>

				<div class="field">
					<label class="label">Location</label>
					<div class="control">
						<button type="button" class="button is-info is-small" on:click={getLocation}>
							Get GPS
						</button>
					</div>
					{#if form.lat}
						<p class="mt-2">📍 {form.lat}, {form.lng}</p>
					{/if}
				</div>

				<div class="field mt-4">
					<button type="submit" class="button is-primary">Save Entry</button>
				</div>
			</form>
		</div>
	</div>
</section>
