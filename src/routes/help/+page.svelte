<script>
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
</script>

<svelte:head>
    <title>FiloStream - Help</title>
</svelte:head>

<div class="container">
    <Header />

    <main>
        <section>
            <div>
                <h1>How to Use FiloStream</h1>
                <p>Welcome to FiloStream! Here’s a quick guide on how to use the platform.</p>
            </div>

            <div>
                <h2>1. Importing Videos and Series</h2>
                <p>To add videos or series to your library, click the <strong>“Import from Drive”</strong> button on the dashboard. 
                    You can choose between importing a single video or an entire series.</p>
            </div>
            
            <div>
                <h2>2. Watching Content</h2>
                <p>Once you've added videos or series, they will appear on your dashboard. Click on a video thumbnail to start watching.</p>
            </div>
            
            <div>
                <h2>3. Keyboard Shortcuts</h2>
                <ul>
                   <li><strong>Esc</strong> - Close the import menu</li>
                </ul>
            </div>
            
            <div>
                <h2>4. Troubleshooting</h2>
                <p>If your videos or series are not appearing, try refreshing the page or checking your Google Drive connection.</p>
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
        margin: 1rem;
        display: grid;
        place-items: center;
    }

    section {
        padding: 1rem;
        display: flex;
        flex-direction: column; 
        gap: 1.2rem;
    }

    h1 {
        color: var(--title-color);
    }
</style>
