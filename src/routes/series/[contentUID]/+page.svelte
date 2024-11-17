<script lang="ts">
    import Icon from "@iconify/svelte"
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import { user } from "$lib/client/hooks/loginState"
    import { afterUpdate } from "svelte"
    import { goto } from "$app/navigation"
    import { page } from "$app/stores"
    import axios from "axios"
    import type { Video, Series, SeriesFile } from "$lib/types/types"

    let userInfo: any
    let contentUID: string | undefined
    let series: Series
    let content: SeriesFile[]
    let contentSize: number

    let loading = true

    $: {
        userInfo = $user
        contentUID = $page.params.contentUID
    }

    afterUpdate(async () => {
        if (!userInfo && userInfo != "Loading...") {
            goto("/login")
        } else if (userInfo && userInfo != "Loading..." && !series) {
            fetchSeries()
        }
    })

    async function fetchSeries() {
        try {
            const response = await axios.get(`/api/getSeries?uid=${contentUID}`)
            
            if (response.status === 200) {
                series = response.data.series.series
                content = series.content

                contentSize = countContent(content)
                loading = false
            } else {
                userVideos = null
                loading = false
            }
        } catch (error) {
            console.error("Error fetching series:", error)
        } finally {
            loading = false
        }
    }

    function countContent(content: SeriesFile[]): number {
        return content.filter(obj => obj.name.endsWith('.mp4')).length
    }
</script>

<svelte:head>
    <title>{series ? `FiloStream - ${series.contentTitle}` : "FiloStream - Series"}</title>
</svelte:head>

<div class="container">
    <Header />

    {#if loading}
        <div class="loading">
            <Icon icon="line-md:loading-twotone-loop" width="8rem" height="8rem" style="color: white" />                        
        </div>
    {:else if series}
    <main>
        <section>
            <div class="seriesInfo">
                <img src={series.contentCover} alt={series.contentTitle} width="300px">                
                <div class="seriesInfoContent">
                    <h1>{series.contentTitle}</h1>
                    <div class="seriesInfoItem">
                        <Icon icon="solar:link-bold" width="1em" height="1em"  style="color: white" />
                        <p>{series.contentUID}</p>
                    </div>
                    <div class="seriesInfoItem">
                        <Icon icon="material-symbols-light:link" width="1.2em" height="1.2em"  style="color: white" />
                        <a href={series.driveURL}>Orginal URL</a>
                    </div>
                    <div class="seriesInfoItem">
                        <Icon icon="system-uicons:episodes" width="1.2em" height="1.2em"  style="color: white" />
                        <p>Size: {contentSize} episodes</p>
                    </div>
                </div>
            </div>
            <div class="episodes">
                {#each content as episode}
                    {#if episode.name.endsWith(".mp4")}
                        <a 
                            class="episode" 
                            href={`/player?ID=${episode.id}&TITLE=${episode.name.replace(/\.mp4$/, "")}`}
                            target="_blank"
                        >
                            <div class="playIcon">
                                <Icon icon="mdi:play-outline" width="2em" height="2em"  style="color: white" />
                            </div>
                            <div class="episodeInfo">
                                <h3>{episode.name.replace(/\.mp4$/, "")}</h3>
                                <p>Assistir</p>
                            </div>
                        </a>
                    {/if}
                {/each}
            </div>
        </section>
    </main>
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
    }

    a {
        color: var(--text-color);
        text-decoration: none;
        font-size: 18px;
        transition: 0.3s color;
    }

    a:hover {
        text-decoration: underline;
    }

    main {
        margin: 1rem;
        height: 80%;
    }

    section {
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 1rem;
        align-items: stretch;
    }

    .seriesInfo {
        padding: 1.2rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2rem;
        justify-content: center;
        border-radius: 0.8rem;
        background: var(--scrollbar-shadow);
        flex-wrap: wrap;
    }

    .seriesInfo img {
        max-width: 100%;
        height: auto;
        border-radius: 0.8rem;
    }

    .seriesInfoContent {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        text-align: center;
    }

    .seriesInfoContent h1 {
        font-size: 2rem;
    }

    .seriesInfoItem {
        display: flex;
        flex-direction: row;
        gap: 0.3rem;
        align-items: center;
        justify-content: center;
    }

    .seriesInfoItem p {
        font-size: 1rem;
    }

    .episodes {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        background: var(--scrollbar-shadow);
        border-radius: 0.8rem;
        overflow-y: auto;
        flex: 1;
    }

    .episode {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 0.8rem;
        padding: 1rem;
        border-radius: 0.8rem;
        background: var(--input-background);
        transition: scale 0.3s, background 0.3s;
    }

    .episode:hover {
        scale: 101%;
        background: var(--input-background-hover);
    }

    .playIcon {
        display: grid;
        place-items: center;
        padding: 0.8rem;
        background: var(--sideBar-background);
        border-radius: 0.3rem;
    }

    @media (max-width: 768px) {
        main {
            height: auto;
        }

        section {
            height: auto;
            flex-direction: column;
            align-items: center;
        }

        .seriesInfo {
            flex-direction: column;
            text-align: center;
        }

        .seriesInfo img {
            max-width: 80%;
        }

        .seriesInfoContent h1 {
            font-size: 1.5rem;
        }

        .seriesInfoItem p, .seriesInfoItem a {
            font-size: 0.9rem;
        }

        .episodes {
            overflow: hidden;
            width: 90%;
        }
    }
</style>
