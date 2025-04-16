<script lang='ts'>
    import { onMount } from 'svelte';
    import { base } from '$app/paths';
    import { fade } from 'svelte/transition';
    import  config from '$lib/config';
    import PopupCreateTournament from '$lib/components/popups/popupCreateTournament.svelte';

    let tourneys: any = [];
    const baseApiUrl = `${config.baseUrl}/api`;
    const baseImgUrl = `${config.baseUrl}/cdn/uploads/`;

    onMount(async () => {
        const res = await fetch(`${baseApiUrl}/getTournaments`);
        const data = await res.json();

        if (data.status === 'success' && Array.isArray(data.tourneys)) {
            tourneys = data.tourneys;
            console.log(tourneys);
        }
    });

    let showPopup = false;

    function openPopup() {
        showPopup = true;
    }
</script>

<svelte:head>
    <title>Tournaments</title>
</svelte:head>

<div class='container'>
    <div class='page-header'>
        <div class='tourneys-title'>
            <p>Tournaments</p>
        </div>
        <button class='open-popup-button' on:click={openPopup}>Create Tournament</button>
    </div>
    <div class='tourney-list'>
        {#each tourneys.sort((a: any, b: any) => a.name.localeCompare(b.name)) as tourney}
            <div class='tourney-box'>
                <div class='tourney-header'>
                    <a href={`${base}/tournaments/${tourney.slug}`}>{tourney.name}</a>
                </div>
                <div class='tourney-body'>
                    {#if tourney.logo !== ''}
                        <img class='tourney-image' src={`${baseImgUrl}${tourney.logo}`} alt={tourney.name} />
                    {:else}
                        <img class='tourney-image' src='/pbui-logo.png' alt={tourney.name} />
                    {/if}
                    <div class='tourney-description'>
                        <p>{tourney.description}</p>
                    </div>
                    <a href={`${base}/tournaments/${tourney.slug}`} class='view-pools' rel='noreferrer'>Pools</a>
                </div>
            </div>
        {/each}
    </div>
    {#if showPopup}
        <div class='create-tourney-popup' transition:fade={{ duration: 250 }}>
            <PopupCreateTournament bind:showPopup />
        </div>
    {/if}
</div>

<style>
    .tourney-header a {
        text-decoration: none;
        color: inherit;
        cursor: text;
        user-select: text;
    }

    .page-header {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
    }

    .tourneys-title {
        position: absolute;
        display: flex;
        font-size: 2.5rem;
        color: var(--text-primary-color);
        font-weight: bold;
        text-align-last: center;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .open-popup-button {
        position: absolute;
        bottom: 0;
        right: 180px;
        background-color: var(--surface-alt-color);
        border: 3px solid var(--border-color);
        color: var(--text-primary-color);
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .open-popup-button:hover {
        background-color: var(--surface-hover-color);
        cursor: pointer;
    }
    
    .tourney-list {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        gap: 35px;
        align-items: center;
    }

    .tourney-box {
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

    .tourney-header {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--text-primary-color);
        margin-bottom: -30px;
        margin-left: 145px;
    }

    .tourney-body {
        display: flex;
        align-items: center;
        gap: 20px;
    }

    .tourney-image {
        width: 125px;
        height: 125px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .tourney-description {
        flex-grow: 1;
        font-size: 1rem;
        color: var(--text-primary-color);
        margin-right: 20px;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .view-pools {
        background-color: var(--surface-alt-color);
        color: var(--text-primary-color);
        padding: 10px 20px;
        text-decoration: none;
        border: 1px solid var(--primary-color);
        border-radius: 4px;
        align-self: flex-middle;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .view-pools:hover {
        background-color: var(--surface-hover-color);
        box-shadow: 0 0 8px var(--primary-color);
        transition: all 0.25s ease;
    }

    .create-tourney-popup {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9990;
    }

    .create-tourney-popup > * {
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>