<script>
	import { enhance } from '$app/forms';

	/** @type {import('./$types').PageData} */
	export let data;

	/** @type {import('./$types').ActionData} */
	export let form;

	let loading = false;
</script>

<div class="container">
	<header>
		<h1>방명록</h1>
		<p class="subtitle">자유롭게 메시지를 남겨주세요.</p>
	</header>

	<section class="form-section">
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="input-group">
				<label for="name">이름</label>
				<input type="text" id="name" name="name" required placeholder="이름을 입력하세요" />
			</div>
			<div class="input-group">
				<label for="message">메시지</label>
				<textarea id="message" name="message" required placeholder="메시지를 입력하세요" rows="3"></textarea>
			</div>
			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}
			<button type="submit" disabled={loading}>
				{loading ? '전송 중...' : '방명록 남기기'}
			</button>
		</form>
	</section>

	<section class="list-section">
		{#if data.guestbook}
			{#each data.guestbook as entry}
				<article class="entry">
					<div class="entry-header">
						<span class="author">{entry.name}</span>
						<span class="date">{new Date(entry.created_at * 1000).toLocaleString()}</span>
					</div>
					<p class="content">{entry.message}</p>
				</article>
			{/each}
		{:else}
			<p class="empty">아직 등록된 방명록이 없습니다.</p>
		{/if}
	</section>
</div>

<style>
	:global(body) {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: #f8f9fa;
		color: #333;
		margin: 0;
		padding: 0;
		line-height: 1.6;
	}

	.container {
		max-width: 600px;
		margin: 4rem auto;
		padding: 0 1.5rem;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.subtitle {
		color: #6b7280;
		font-size: 1.1rem;
	}

	.form-section {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
		margin-bottom: 3rem;
	}

	.input-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #374151;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: border-color 0.2s, box-shadow 0.2s;
		box-sizing: border-box; /* Fix for width 100% causing overflow */
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #6366f1;
		box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
	}

	button {
		width: 100%;
		padding: 0.875rem;
		background: #6366f1;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s, transform 0.1s;
	}

	button:hover {
		background: #4f46e5;
	}

	button:active {
		transform: scale(0.98);
	}

	button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.entry {
		background: white;
		padding: 1.5rem;
		border-radius: 0.75rem;
		margin-bottom: 1rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
		border-left: 4px solid #a855f7;
	}

	.entry-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
	}

	.author {
		font-weight: 700;
		color: #111827;
	}

	.date {
		color: #9ca3af;
	}

	.content {
		color: #4b5563;
		white-space: pre-wrap;
	}

	.empty {
		text-align: center;
		color: #9ca3af;
		margin-top: 2rem;
	}

	.error {
		color: #ef4444;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}
</style>
