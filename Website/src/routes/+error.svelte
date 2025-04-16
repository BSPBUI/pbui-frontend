<script lang='ts'>
    import { page } from '$app/state';
</script>

<svelte:head>
    <title>Page Not Found - {page.url.pathname}</title>
</svelte:head>

<div class='container'>
    <div class='error-box'>
        <div class='title-text'>
            <p>Page not found</p>
        </div>
        <div class='body'>
            <p>The page you were looking for, <code>{page.url.pathname}</code>, cannot be found.<br>
               If you believe this is a mistake, please contact <a href='https://discord.com/users/733798777974161478'>Ultraslayyy</a> or <a href='https://discord.com/users/393077639583367178'>Heggo</a>.</p>
        </div>
    </div>
</div>

<style>
    code {
        background-color: var(--surface-color);
    }

    .container {
        position: fixed;
        top: 150px;
        left: 0;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
    }

    .error-box {
        display: flex;
        flex-direction: column;
        background-color: var(--surface-alt-color);
        border: 3px solid var(--border-color);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        width: 600px;
        height: 600px;
    }

    .title-text {
        display: flex;
        font-size: 2.5rem;
        color: var(--text-primary-color);
        font-weight: bold;
        text-align: center;
        justify-content: center;
    }

    .body {
        font-size: 1.1rem;
        color: var(--text-primary-color)
    }

    .body a {
        color: var(--primary-color);
    }
</style>