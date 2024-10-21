<script lang="ts">
    import FiloStream from "$lib/Assets/FiloStream.png"
    import Icon from "@iconify/svelte"
</script>

<header>
    <a href="/">
        <img src={FiloStream} width="84px" alt="FiloStream.">
    </a>

    <nav>
        <ul>
            <li>
                <a href="/dashboard">Dashboard</a>
            </li>
            <li>
                <a href="/credits">Credits</a>
            </li>
        </ul>
    </nav>

    <button on:click={() => alert('To do!')}><Icon icon="material-symbols:login" width="1.2em" height="1.2em"  style="color: white" /> Login</button>
</header>

<style>
    header {
        padding: 1rem;
        background: var(--button-background);
        border-radius: 0 0 1rem 1rem;
        display: flex;
        font-display: row;
        justify-content: space-around;
        align-items: center;
    }

    ul {
        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    a {
        color: var(--text-color);
        text-decoration: none;
        font-size: 18px;
        transition: 0.3s color;
    }

    a:hover {
        color: var(--text-alternative);
        text-decoration: underline;
    }

    button {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        cursor: pointer;
        color: var(--text-alternative);
        padding: 1.2rem;
        background: var(--red-primary-color);
        border: none;
        border-radius: 0.8rem;
        transition: 0.3s background;
    }

    button:hover {
        background: var(--red-secondary-color);
    }
</style>
