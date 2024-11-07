<script lang="ts">
    import { z } from "zod"
    import Icon from "@iconify/svelte"
    import DriveIcon from "$lib/assets/drive.svg"
    import axios from "axios"
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import { goto } from "$app/navigation"
    import { user } from "$lib/client/hooks/loginState"
    import { afterUpdate, onMount, onDestroy } from "svelte"
    import toast, { Toaster } from "svelte-french-toast"
    import { Splide, SplideSlide } from "@splidejs/svelte-splide"
    import "@splidejs/svelte-splide/css"
    import type { Video } from "$lib/types/types"
    import ImportMenuDrive from "$lib/components/ImportMenuDrive.svelte"

    let userInfo: any
    let userVideos: Video[] = []
    let loadingVideos = true
    let toggleMenuValue = false

    function toggleMenu() {
        toggleMenuValue = !toggleMenuValue
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'n') {
            toggleMenu()
        }

        if (event.key === 'Escape' && toggleMenuValue) {
            toggleMenu()
        }
    }

    $: userInfo = $user

    afterUpdate(async () => {
        if (!userInfo && userInfo != "Loading...") {
            goto("/login")
        } else if (userInfo && userInfo != "Loading..." && userVideos.length <= 0) {
            await fetchUserVideos(userInfo.uid)
        }
    })

    onMount(() => {
        window.addEventListener('keydown', handleKeydown)
            onDestroy(() => window.removeEventListener('keydown', handleKeydown))
    })

    async function fetchUserVideos(uid: string) {
        try {
            const response = await axios.get(`/api/getUserVideos?uid=${uid}`)
            if (response.status === 200) {
                userVideos = response.data.videos || []
            } else {
                userVideos = []
            }
        } catch (error) {
            console.error("Error fetching user videos:", error)
        } finally {
            loadingVideos = false
        }
    }

    function handleSuccess(message: string) {
        toast.success(message, { style: 'background: #222; color: #fff;' });
    }
</script>

<svelte:head>
    <title>FiloStream - Dashboard</title>
</svelte:head>

<div class="container">
    <Toaster />
    <Header />

    {#if toggleMenuValue}
        <ImportMenuDrive 
            {toggleMenu} 
            {userInfo} 
            on:success={(event) => handleSuccess(event.detail)} 
        />
    {/if}

    <main>
        <section>
            <div class="title">
                <div>
                    <h1>Welcome to dashboard!</h1>
                    <p>Need help? <a href="/">See a FiloStream tutorial here!</a></p>
                </div>
                <div>
                    <button class="driveButton" on:click={toggleMenu}><img src={DriveIcon} width="25px" alt="Google Drive"> Import from Drive</button>
                </div>
            </div>
            <div class="videoSection">
                <h2>Your Videos</h2>
                {#if loadingVideos}
                    <Icon icon="line-md:loading-twotone-loop" width="8rem" height="8rem" style="color: white" />
                {:else if userVideos.length > 0}
                    <Splide aria-label="Your Videos" options={{
                        rewind: true,
                        perPage: 3,
                        focus: 'center',
                        breakpoints: {
                            800: {
                                perPage: 1, 
                            },
                            1200: {
                                perPage: 2,
                            },
                        },
                    }}>
                        {#each userVideos as video}
                            <SplideSlide>
                                <li class="video" style={`background-image: url(${video.contentCover});`}>
                                    <a href={`/player?ID=${video.fileId}&TITLE=${video.contentTitle}`}>
                                        <div class="overlay"></div>
                                        <h1>{video.contentTitle}</h1>     
                                    </a>
                                </li>
                            </SplideSlide>
                        {/each}
                    </Splide>
                {:else}
                    <p>No videos found. Add some videos to get started!</p>
                {/if}
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
        position: relative;
        flex-grow: 1;
    }

    section {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        margin: 3rem;
    }

    .title {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
    }

    a {
        color: var(--title-color);
    }

    .driveButton {
        display: flex;
        flex-direction: row;
        gap: 0.3rem;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-alternative);
        padding: 1.2rem;
        background: var(--red-primary-color);
        border: none;
        border-radius: 0.8rem;
        transition: 0.3s background;
    }

    .driveButton:hover {
        background: var(--red-secondary-color);
    }

    .video {
        cursor: pointer;
        position: relative;
        height: 500px;
        width: 100%; 
        max-width: 400px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: 0.8rem;
        transition: scale 0.3s ease;
        display: flex;
        justify-content: flex-start;
        align-items: flex-end;
    }

    .video:hover {
        scale: 101%;
    }

    .video a {
        color: white;
        text-decoration: none;
    }

    .video h1 {
        margin: 1rem;
        position: relative;
        z-index: 1;
    }

    .overlay {
        position: absolute;
        border-radius: 0.8rem;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        background-color: rgba(0, 0, 0, 0.5);
        transition: background-color 0.3s ease;
    }

    .video:hover .overlay {
        background-color: rgba(0, 0, 0, 0.3);
    }
</style>
