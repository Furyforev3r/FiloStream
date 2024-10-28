<script>
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import { onMount } from "svelte"
    import { page } from "$app/stores"
    import { goto } from "$app/navigation"
    import Player from "$lib/components/Player.svelte"

    let videoID = $page.url.searchParams.get('ID')
    let videoTITLE = $page.url.searchParams.get('TITLE')

    let publicApiKey = "AIzaSyAIFj2jLpaAsRLE9tyR-JCzEHNhDwp27ao"


    onMount(() => {
        if (videoURL == null) {
            goto("/dashboard")
        }
    })
</script>

<svelte:head>
    <title>FiloStream - {videoTITLE}</title>
</svelte:head>

<div class="container">
    <Header />

    <main>
        <section>
            <h1>{videoTITLE}</h1>
            <div class="player">
                <Player URL={`https://www.googleapis.com/drive/v3/files/${videoID}?alt=media&key=${publicApiKey}`} TITLE={videoTITLE} />            
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
