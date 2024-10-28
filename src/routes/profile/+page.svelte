<script lang="ts">
    import Icon from "@iconify/svelte"
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import { user } from "$lib/client/hooks/loginState"
    import { afterUpdate } from "svelte"
    import axios from "axios"
    import { logout } from "$lib/client/utils/firebaseUtils"
    import { goto } from "$app/navigation"

    let userInfo
    let userAccount

    $: userInfo = $user

    afterUpdate(async () => {
        if (userInfo && userInfo != "Loading..." && !userAccount) {
            const response = await axios.get(`/api/getUser/?uid=${userInfo.uid}`)
            userAccount = response.data
        }
        else if (!userInfo) {
            goto("/")
        }
    })
</script>

<svelte:head>
    <title>FiloStream - Profile</title>
</svelte:head>

<div class="container">
    <Header />

    {#if userInfo == 'Loading...'}
        <div class="loading">
            <Icon icon="svg-spinners:3-dots-move" width="6rem" height="6rem" style="color: white" />
        </div>
    {:else if userAccount}
        <main>
            <section>
                <div>
                    <img src={userAccount.user.photoURL} alt={userAccount.user.displayName} width="84px">                    
                </div>
                <div class="content">
                    <h1>{userAccount.user.username}'s profile</h1>
                    <p>Email: {userAccount.user.email}</p>
                    <button on:click={logout}><Icon icon="material-symbols:logout" width="1.2em" height="1.2em"  style="color: white" /> Logout</button>
                </div>
            </section>
        </main>
    {:else}
        <div class="loading">
            <Icon icon="svg-spinners:3-dots-move" width="6rem" height="6rem" style="color: white" />
        </div>
    {/if}

    <Footer />
</div>

<style>
    .container {
        height: 100dvh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .loading {
        display: grid;
        place-items: center;
        height: 100%;
        width: 100%;      
    }

    main {
        display: grid;
        place-items: center;
    }

    section {
        background: var(--button-background);
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.8rem;
        padding: 1rem;
        border-radius: 0.8rem;
    }

    img {
        border-radius: 0.8rem;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        margin-block: 0.3rem;
        cursor: pointer;
        color: var(--text-alternative);
        padding: 1rem;
        background: var(--red-primary-color);
        border: none;
        border-radius: 0.8rem;
        transition: 0.3s background;
    }

    button:hover {
        background: var(--red-secondary-color);
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    @media (max-width: 800px) {
        section {
            flex-direction: column;
        }

        .content {
            flex-direction: column;
        }
    }
</style>
