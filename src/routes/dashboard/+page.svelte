<script lang="ts">
    import { z } from "zod"
    import Icon from "@iconify/svelte"
    import DriveIcon from "$lib/assets/drive.svg"
    import axios from "axios"
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import { goto } from "$app/navigation"
    import { user } from "$lib/client/hooks/loginState"
    import { afterUpdate } from "svelte"
    import toast, { Toaster } from "svelte-french-toast"
    import { Splide, SplideSlide } from "@splidejs/svelte-splide"
    import "@splidejs/svelte-splide/css"

    let userInfo
    let userVideos = []
    let loadingVideos = true

    $: userInfo = $user

    afterUpdate(async () => {
        if (!userInfo && userInfo != "Loading...") {
            goto("/login")
        } else if (userInfo && userInfo != "Loading..." && userVideos.length <= 0) {
            await fetchUserVideos(userInfo.uid)
        }
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

    let toastMenu = false
    let loading = false
    let title = ""
    let url = ""
    let cover = ""
    let formError = ""

    const videoSchema = z.object({
        title: z.string().min(1, { message: "Title is required" }),
        url: z.string().url({ message: "Invalid URL format" }),
        cover: z.string().url({ message: "Invalid cover URL format" })
    })

    function toggleToast() {
        toastMenu = !toastMenu
    }

    async function handleSubmit(event) {
        event.preventDefault()
        formError = ""

        const result = videoSchema.safeParse({ title, url, cover })

        if (!result.success) {
            formError = result.error.errors.map(err => err.message).join(", ")
            console.error(formError)
            return
        }

        try {
            loading = true

            const response = await axios.post("/api/newVideo", {
                userUID: userInfo.uid,
                contentTitle: title,
                driveURL: url,
                contentCover: cover
            }, {
                headers: { "Content-Type": "application/json" },
                timeout: 0 
            })

            if (response.status === 201) {
                toggleToast()
                toast.success("Video added successfully!", {
                    style: 'background: #222; color: #fff;'
                })
            } else {
                formError = response.data.error || "Failed to add video"
                console.error(formError)
            }

            loading = false
        } catch (error) {
            console.error("Error adding video:", error)
            formError = error.response?.data?.error || "Network error, please try again later"
        }
    }
</script>

<svelte:head>
    <title>FiloStream - Dashboard</title>
</svelte:head>

<div class="container">
    <Toaster />
    <Header />

    {#if toastMenu}
        <div class="importToastContainter">
            <div class="importToast">
                <div class="importTitle">
                    <h2>Import from Google Drive</h2>
                    <button on:click={toggleToast} class="importButton">
                        <Icon icon="material-symbols:close" width="2em" height="2em" style="color: #F46464" />
                    </button>
                </div>
                <form class="importContent" on:submit={handleSubmit}>
                    <p>Content title</p>
                    <input type="text" bind:value={title} placeholder="Titanic - Full Movie" required>
                    <p>Content URL</p>
                    <input type="url" bind:value={url} placeholder="https://drive.google.com/file/d/example-url/view?usp=drive_link" required>
                    <p>Content cover</p>
                    <input type="url" bind:value={cover} placeholder="https://drive.google.com/file/d/poster-example-url/view?usp=drive_link" required>
                    {#if formError}
                        <p class="error">{formError}</p>
                    {/if}
                    {#if !loading}
                        <input type="submit" value="Import">
                    {:else}
                        <button class="loadingButton"><Icon icon="line-md:loading-twotone-loop" width="1.2em" height="1.2em"  style="color: white" /></button>
                    {/if}
                </form>
            </div>
        </div>
    {/if}

    <main>
        <section>
            <div class="title">
                <div>
                    <h1>Welcome to dashboard!</h1>
                    <p>Need help? <a href="/">See a FiloStream tutorial here!</a></p>
                </div>
                <div>
                    <button class="driveButton" on:click={toggleToast}><img src={DriveIcon} width="25px" alt="Google Drive"> Import from Drive</button>
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
                                    <a href={`/player?URL=${video.videoURL}&TITLE=${video.contentTitle}`}>
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

    .importToastContainter {
        position: absolute;
        overflow: auto;
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        animation: fade 0.3s;
    }

    .error {
        color: var(--red-primary-color);
        font-size: 0.9rem;
    }

    @keyframes fade {
        0% {
            opacity: 0%;
        }
        100% {
            opacity: 100%;
        }
    }

    .importToast {
        width: 40%;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        border-radius: 0.8rem;
        background: var(--button-background);
    }

    .importTitle {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }

    .importButton {
        cursor: pointer;
        background: none;
        border: none;
        outline: none;
    }

    .importContent {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    input[type="text"], input[type="url"] {
        background: var(--button-hover);
        color: var(--text-alternative);
        border: none;
        padding: 0.8rem;
        border-radius: 0.8rem;
    }

    input[type="text"]:focus, input[type="url"]:focus {
        border: none;
        outline: none;
    }

    input[type="submit"], .loadingButton {
        cursor: pointer;
        color: var(--text-alternative);
        padding: 1.2rem;
        margin-block: 0.8rem;
        background: var(--red-primary-color);
        border: none;
        border-radius: 0.8rem;
        transition: 0.3s background;
    }

    input[type="submit"]:hover {
        background: var(--red-secondary-color);
    }

    .loadingButton {
        padding: 1.2rem;
        background: var(--button-hover);
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

    @media (max-width: 800px) {
        .importToast {
            width: 80%;
        }
    }
</style>
