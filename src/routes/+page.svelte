<script lang="ts">
    import Icon from "@iconify/svelte"
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import FiloStream from "$lib/assets/FiloStream.png"
    import { goto } from "$app/navigation"
    import { user } from "$lib/client/hooks/loginState"
    
    let userInfo

    $: userInfo = $user

    function handleGetStarted() {
        if (userInfo) {
            goto("/dashboard")
        } else {
            goto("/login")
        }
    }
</script>

<svelte:head>
    <title>FiloStream - Home</title>
    <meta name="description" content="Filo Stream." />
</svelte:head>

<div class="container">
    <Header />

    <main>
        <section>
           <img src={FiloStream} width="250px" alt="FiloStream.">
            <div class="FiloStream">
                <div>
                    <h1>FiloStream</h1>
                    <p>Stream all your favorite content quickly, easily and organized.</p>
                </div>
                <div class="button">
                    <button on:click={handleGetStarted}><Icon icon="mdi:play-outline" width="1.2em" height="1.2em"  style="color: white" /> Get started!</button>                    
                </div>
            </div>
        </section>
    </main>

    <Footer />
</div>

<style>
    .container {
        height: 100dvh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    main {
        margin: 3rem;
    }

    section {
        display: flex;
        flex-direction: row;
        width: 100%;
        align-items: center;
        justify-content: space-evenly;
    }

    section img {
        cursor: pointer;
        transition: transform 0.3s;
    }

    section img:hover {
        transform: translateY(-3px);
    }

    .FiloStream {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    h1 {
        font-size: 32px;
    }

    .button {
        display: grid;
        place-items: center;
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

    @media (max-width: 800px) {
        section {
            flex-direction: column;
            gap: 1rem;
        }
    }
</style>
