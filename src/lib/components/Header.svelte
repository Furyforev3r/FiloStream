<script lang="ts">
    import FiloStream from "$lib/assets/FiloStream.png"
    import Icon from "@iconify/svelte"
    import { goto } from "$app/navigation"
    import { user } from "$lib/client/hooks/loginState"
    import { afterUpdate } from "svelte"
    import axios from "axios"
    import type { FiloUserRedirect } from "$lib/types/types"

    let userInfo
    let userAccount: FiloUserRedirect

    $: userInfo = $user

    afterUpdate(async () => {
        if (userInfo && userInfo != "Loading..." && !userAccount) {
            const response = await axios.get(`/api/getUser/?uid=${userInfo.uid}`)
            userAccount = response.data
        }
    })
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
                <a href="/help">Help</a>
            </li>
        </ul>
    </nav>
    {#if !userInfo}
        <button on:click={() => goto('/login')}><Icon icon="material-symbols:login" width="1.2em" height="1.2em"  style="color: white" /> Login</button>
    {:else if userAccount}
        <a href="/profile"><img class="userPhoto" src={userAccount.user.photoURL} alt={userAccount.user.displayName} width="84px"></a>
    {:else if userInfo == "Loading..."}
        <div class="loading"></div>
    {:else}
        <div class="loading"></div>
    {/if}
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

    .userPhoto {
        cursor: pointer ;
        object-fit: cover;
        border-radius: 100%;
        transition: 0.3s opacity;
    }

    .userPhoto:hover {
        opacity: 80%;
    }

    @keyframes backgroundChange {
        0% {
            background-color: var(--foreground);
        }
        100% {
            background-color: var(--button-background);
        }
    }

    .loading {
        cursor: pointer;
        width: 84px;
        height: 84px;
        background: var(--foreground);
        border-radius: 999px;
        animation: backgroundChange 3s ease-in-out infinite alternate;
    }

    @media (max-width: 800px) {
        nav {
            display: none;
        }
    }
</style>
