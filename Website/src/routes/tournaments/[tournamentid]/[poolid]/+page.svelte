<script lang="ts">
    import { onMount } from 'svelte';
    import config from '$lib/config.js';

    let pageTitle: string;
    let pool: any = [];
    let maps: any = [];
    export let data;

    const poolid = data.poolid;

    onMount(async () => {
        const res = await fetch(`${config.baseUrl}/api/getPool/${poolid}?maps=true`);
        const data = await res.json();

        if (data.status === 'success' && Array.isArray(data.maps)) {
            pool = data.details;
            maps = data.maps;
        }

        pageTitle = `'${pool.name}' Pool`
    });

    const diffColors = {
        easy: '#008055',
        normal: '#1268a1',
        hard: '#bd5500',
        expert: '#b52a1c',
        expertplus: '#7646af'
    }

    function formatTime(duration: number) {
        const mins = ~~(duration / 60);
        const secs = ~~duration % 60;
        let ret = '';

        ret += '' + mins + ':' + (secs < 10 ? '0' : '');
        ret += '' + secs;
        return ret;
    }
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>

<div class='container'>
    <div class='maps-title'>
        <p>Maps for {pool.name}</p>
    </div>
    <div class='maps-list'>
        {#each maps.sort((a: any, b: any) => a.name.localeCompare(b.name)) as map}
            <div class='map-card'>
                <div class='map-header'>
                    <p>{map.name}</p>
                    <div class='map-diff' style={`background-color: ${diffColors[map.difficulty.toLowerCase() as keyof typeof diffColors]}`}>{map.difficulty}</div>
                </div>
                <div class='map-body'>
                    <img class='map-image' src={map.coverUrl} alt={map.name} />
                    <div class='map-interior-left'>
                        <p class='song-artist'>Song Artist: {map.artist}</p>
                        <p class='mapper'>{map.mapper}</p>
                        <p class='length'>{formatTime(map.length)}</p>
                    </div>
                    <div class='map-interior-right'>
                        <p class='bsr'>{map.bsr}</p>
                        <p class='bpm'>{map.bpm}</p>
                        <p class='dateUploaded'>{map.dateUploaded}</p>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>
    .maps-title {
        font-size: 2.5rem;
        color: var(--text-primary-color);
        font-weight: bold;
        text-align-last: center;
        margin-top: 20px;
        margin-bottom: 30px;
    }

    .maps-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        row-gap: 50px;
    }

    .map-card {
        position: relative;
        flex-direction: row;
        background-color: var(--surface-color);
        border: 3px solid var(--border-color);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 90%;
        max-width: 700px;
        min-width: 600px;
        height: 125px;
    }

    .map-header {
        display: flex;
        font-size: 1.5rem;
        justify-content: space-between;
        align-items: center;
        font-weight: bold;
        color: var(--text-primary-color);
        margin-bottom: -30px;
        margin-left: 145px;
        margin-top: -30px;
    }

    .map-body {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .map-image {
        width: 125px;
        height: 125px;
        object-fit: cover;
        border-radius: 16px;
        margin-top: -36px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .map-interior-left {
        flex-grow: 1;
        font-size: 1.05rem;
        color: var(--text-primary-color);
        margin-right: 20px;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: transparent;
    }

    .map-interior-right {
        font-size: 1.05rem;
        text-align: right;
        margin-left: auto;
    }

    .map-diff {
        font-size: initial;
        font-weight: initial;
        width: fit-content;
        max-width: 100%;
        padding: 2px 7px;
        border-radius: 10px;
    }
</style>