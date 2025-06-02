<script lang="ts">
	type FishingEntry = {
		id: string;
		date: string;
		time: string;
		fisher: string;
		fishType: string;
		length: string;
		weight: string;
		lure: string;
		notes: string;
		imageURL: string;
		lat: string;
		lng: string;
	};

	let entries: FishingEntry[] = [];

	// Load entries on mount
	if (typeof localStorage !== 'undefined') {
		const data = localStorage.getItem('fishing-entries');
		entries = data ? JSON.parse(data) : [];
		entries.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
	}
</script>

<section class="section">
	<div class="container">
		<h1 class="title">🎣 Fishing Journal</h1>

		<a class="button is-primary mb-4" href="/new">+ Add New Entry</a>

		{#if entries.length === 0}
			<p class="has-text-grey">No entries yet. Go catch something!</p>
		{:else}
			<div class="columns is-multiline">
				{#each entries as entry}
					<div class="column is-full-mobile is-half-tablet is-one-third-desktop">
						<a href={`/entry/${entry.id}`}>
							<div class="box">
								<article class="media">
									{#if entry.imageURL}
										<figure class="media-left">
											<p class="image is-64x64">
												<img src={entry.imageURL} alt="Fish" />
											</p>
										</figure>
									{/if}
									<div class="media-content">
										<div class="content">
											<p>
												<strong>{entry.fisher}</strong> <small>{entry.date} @ {entry.time}</small><br />
												{entry.fishType}, {entry.length}" / {entry.weight} lb<br />
												<em>{entry.notes}</em>
											</p>
										</div>
									</div>
								</article>
							</div>
						</a>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
