<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import config from '$lib/config';

    export let showPopup = false;

    let tourneyName = '';
    let tourneySlug = '';
    let validationError = '';

    onMount(() => {
        window.addEventListener('keydown', handleEscape);
    });
    onDestroy(() => {
        window.removeEventListener('keydown', handleEscape);
    });

    function closePopup() {
        showPopup = false;
        tourneyName = '';
        tourneySlug = '';
        validationError = '';
    }

    async function createTournament() {
        const isTournamentValid = validInfo('both', tourneyName, tourneySlug);

        if (!isTournamentValid) {
            return;
        }

        fetch(`${config.baseUrl}/api/createTournament`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: tourneyName, slug: tourneySlug })
        })
        .then(res => res.json())
        .then(data => console.log(data));
    }

    function validInfo(type: 'name' | 'slug' | 'both', name: string, slug: string) {
        let regex;
        if (type === 'name' || 'both') {
            regex = /^[a-zA-Z0-9 ]{1,255}$/;
            if (!regex.test(name)) {
                validationError = 'Tournament name must be 255 characters or less, and is only permitted to contain letters and numbers';
                return false;
            }
        }
        if (type === 'slug' || 'both') {
            regex = /^[a-z0-9_-]{1,32}$/
            if (!regex.test(slug)) {
                validationError = 'Tournament slug must be 32 character or less, and it only permitted to contain lowercase letters, numbers, _, and -';
                return false;
            }
            validationError = '';
            return true;
        }
    }

    function handleNameInput() {
        tourneyName = tourneyName.replace(/[^a-zA-Z 0-9!@#%&]/g, '');
        validInfo('name', tourneyName, '');
    }
  
    function handleIDInput() {
        tourneySlug = tourneySlug.replace(/[^a-zA-Z0-9]/g, '');
        validInfo('slug', '', tourneySlug);
    }

    // @ts-ignore
    function handleEscape(event) {
        if (event.key === 'Escape') {
            closePopup();
        }
    }
</script>

{#if showPopup}
    <div class='container'>
        <div class='title'>
            <p>Create New Tournament</p>
        </div>
        <div class='input-container'>
            <div class='input-group'>
                <label for='tourney-name-input'>Name:</label>
                <input type='text' class='tourney-name-input' bind:value={tourneyName} on:input={handleNameInput} placeholder='Tournament Name' maxlength='255' />
            </div>
            <div class='input-group'>
                <label for='tourney-slug-input'>Identifier:</label>
                <input type='text' class='tourney-slug-input' bind:value={tourneySlug} on:input={handleIDInput} placeholder='Tournament Indentifier' maxlength='32' />
            </div>
        </div>
        <div class='button-container'>
            <button type='button' class='buttonCancel' on:click={closePopup}>Cancel</button>
            <button type='submit' class='buttonSubmit' on:click={createTournament}>Create</button>
        </div>
    </div>
{/if}

<style>
    .container {
        display: flex;
        flex-direction: column;
        background-color: var(--surface-color);
        border: 3px solid var(--border-color);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 400px;
        height: 280px;
    }

    .title {
        font-size: 1.5rem;
        color: var(--text-primary-color);
        font-weight: bold;
        text-align-last: center;
        margin-top: -23px;
    }

    .input-container {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    label {
        font-weight: bold;
        color: var(--text-primary-color);
    }

    input {
        padding: 8px;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary-color);
        background-color: var(--surface-alt-color);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .button-container {
        position: relative;
        display: flex;
        flex-direction: row;
        gap: 40px;
        align-items: flex-end;
        justify-content: center;
        height: 270px;
    }

    button {
        cursor: pointer;
        color: var(--text-primary-color);
        border: 3px solid var(--border-color);
        background-color: var(--surface-alt-color);
        padding-top: 15px;
        padding-bottom: 15px;
        padding-left: 35px;
        padding-right: 35px;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    button:hover {
        background-color: var(--surface-hover-color);
    }
</style>