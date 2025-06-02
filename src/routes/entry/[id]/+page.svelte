<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';

	let entry: any = null;
	let notFound = false;
	let mapContainer: HTMLDivElement;
	let map: any = null;

	onMount(async () => {
		const id = $page.params.id;
		const stored = localStorage.getItem('fishing-entries');
		const entries = stored ? JSON.parse(stored) : [];
		entry = entries.find((e: any) => e.id === id);

		if (!entry) {
			notFound = true;
			return;
		}

		if (entry.lat && entry.lng && typeof window !== 'undefined') {
			// Import Leaflet CSS first
			const leafletCSS = document.createElement('link');
			leafletCSS.rel = 'stylesheet';
			leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
			leafletCSS.crossOrigin = '';
			document.head.appendChild(leafletCSS);

			const leaflet = await import('leaflet');

			// Wait for the container to be available and have dimensions
			const initMap = () => {
				if (mapContainer && mapContainer.clientHeight > 0 && mapContainer.clientWidth > 0) {
					try {
						map = leaflet.map(mapContainer).setView([+entry.lat, +entry.lng], 13);

						leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
							attribution: '&copy; OpenStreetMap contributors'
						}).addTo(map);

						leaflet
							.marker([+entry.lat, +entry.lng])
							.addTo(map)
							.bindPopup(`${entry.fishType || 'Catch'} by ${entry.fisher}`)
							.openPopup();

						// Small delay to ensure proper rendering
						setTimeout(() => {
							if (map) {
								map.invalidateSize();
							}
						}, 100);
					} catch (error) {
						console.error('Error initializing map:', error);
					}
				} else {
					// Retry after a short delay if container isn't ready
					setTimeout(initMap, 50);
				}
			};

			initMap();
		}
	});

	onDestroy(() => {
		if (map) {
			map.remove();
		}
	});
</script>

<section class="section">
	<div class="container">
		{#if notFound}
			<div class="notification is-danger">Entry not found.</div>
		{:else if entry}
			<a class="button is-light mb-4" href="/">← Back to Log</a>
			<a class="button is-warning mb-4 ml-2" href={`/entry/${entry.id}/edit`}>✏️ Edit Entry</a>

			<h1 class="title">🎣 {entry.fisher}'s Catch</h1>

			{#if entry.imageURL}
				<figure class="image is-3by2 mb-4">
					<img src={entry.imageURL} alt="Fish Photo" />
				</figure>
			{/if}

			<table class="table is-fullwidth">
				<tbody>
					<tr><th>Date</th><td>{entry.date} @ {entry.time}</td></tr>
					<tr><th>Fish</th><td>{entry.fishType}</td></tr>
					<tr><th>Length</th><td>{entry.length}"</td></tr>
					<tr><th>Weight</th><td>{entry.weight} lbs</td></tr>
					<tr><th>Lure</th><td>{entry.lure}</td></tr>
					<tr><th>Location</th><td>{entry.lat}, {entry.lng}</td></tr>
					<tr><th>Notes</th><td>{entry.notes}</td></tr>
				</tbody>
			</table>

			{#if entry.lat && entry.lng}
				<div bind:this={mapContainer} id="map"></div>
			{/if}
		{/if}
	</div>
</section>

<style>
	#map {
		width: 100%;
		height: 300px;
		border-radius: 8px;
		margin-top: 1rem;
		z-index: 0; /* Ensure proper stacking */
	}
</style>