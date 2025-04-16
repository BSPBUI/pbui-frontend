<script lang='ts'>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    import config from '$lib/config.js';

    let pageTitle: string;
    let tourney: any = [];
    let pools: any = [];
    export let data;

    const baseImgUrl = `${config.baseUrl}/cdn/uploads/`;

    const slug = data.tournamentslug;

    onMount(async () => {
        const res = await fetch(`${config.baseUrl}/api/getTournaments/slug/${slug}?pools=true`);
        const data = await res.json();

        if (data.status === 'success' && Array.isArray(data.pools)) {
            tourney = data.details;
            pools = data.pools;
        }

        pageTitle = tourney.slug;
    });
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<div class='container'>
    <div class='pools-title'>
        <p>Pools for {tourney.name}</p>
    </div>
    <div class='pools-list'>
        {#each pools.sort((a: any, b: any) => a.name.localeCompare(b.name)) as pool}
            <div class='pool-card'>
                <div class='pool-header'>
                    <a href='/'>{pool.name}</a>
                </div>
                <div class='pool-body'>
                    <img class='pool-image' src={`${baseImgUrl}${pool.image}`} alt={pool.name} />
                    <div class='pool-description'>
                        <p></p>
                    </div>
                    <a href={`${base}/tournaments/${tourney.slug}/${pool.id}`} class='view-maps' rel='noreferrer'>Maps</a>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .pool-header a {
        text-decoration: none;
        color: inherit;
        cursor: text;
        user-select: text;
    }

    .pools-title {
        font-size: 2.5rem;
        color: var(--text-primary-color);
        font-weight: bold;
        text-align-last: center;
        margin-top: 20px;
        margin-bottom: 30px;
    }

    .pools-list {
        display: flex;
        flex-direction: column;
        gap: 35px;
        align-items: center;
    }

    .pool-card {
        display: flex;
        flex-direction: column;
        background-color: var(--surface-color);
        border: 3px solid var(--border-color);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 1200px;
        min-width: 600px;
    }

    .pool-header {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--text-primary-color);
        margin-bottom: -30px;
        margin-left: 145px;
        transition: none;
    }

    .pool-body {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .pool-image {
        width: 125px;
        height: 125px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .pool-description {
        flex-grow: 1;
        font-size: 1rem;
        color: var(--text-primary-color);
        margin-right: 20px;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .view-maps {
        background-color: var(--surface-alt-color);
        color: var(--text-primary-color);
        padding: 10px 20px;
        text-decoration: none;
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .view-maps:hover {
        background-color: var(--surface-hover-color);
        box-shadow: 0 0 8px var(--primary-color);
        transition: all 0.25s ease;
    }
</style>