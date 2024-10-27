<script>
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import { onMount } from "svelte"
    import { page } from "$app/stores"
    import { goto } from "$app/navigation"
    import Player from "$lib/components/Player.svelte"

    let videoURL = $page.url.searchParams.get('URL')
    let videoTITLE = $page.url.searchParams.get('TITLE')

    let apiKey

    if (import.meta.env) {
        apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY
    } else {
        apiKey = process.env.VITE_GOOGLE_DRIVE_API_KEY
    }


    onMount(() => {
        if (videoURL == null) {
            goto("/dashboard")
        }
    })
</script>

<div class="container">
    <Header />

    <main>
        <section>
            <h1>{videoTITLE}</h1>
            <div class="player">
                <Player URL={`${videoURL}&key=${apiKey}`} TITLE={videoTITLE} />            
            </div>
            <p>Thank you for using FiloStream! ❤️</p>
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
        margin-block: 3rem;
    }

    section {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.2rem;
    }

    .player {
        display: grid;
        place-items: center;
        width: 100%;
        border-radius: 0.8rem;
    }
</style>
