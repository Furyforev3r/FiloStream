<script lang="ts">
    import Icon from "@iconify/svelte"
    import { z } from "zod"
    import { createEventDispatcher } from "svelte"
    import axios from "axios"

    export let toggleMenu: () => void
    export let userInfo: any

    let contentTitle = ""
    let contentUID = ""
    let driveURL = ""
    let contentCover = ""
    let formError = ""
    let loading = false

    const seriesSchema = z.object({
        contentTitle: z.string().min(1, { message: "Title is required" }),
        contentUID: z.string().min(1, { message: "Content UID is required" }),
        driveURL: z.string().url({ message: "Invalid URL format" }),
        contentCover: z.string().url({ message: "Invalid cover URL format" })
    })

    const dispatch = createEventDispatcher()

    async function handleSubmit(event: any) {
        event.preventDefault()
        formError = ""

        const result = seriesSchema.safeParse({ contentTitle, contentUID, driveURL, contentCover })

        if (!result.success) {
            formError = result.error.errors.map(err => err.message).join(", ")
            console.error(formError)
            return
        }

        try {
            loading = true

            const response = await axios.post("/api/newSeries", {
                userUID: userInfo.uid,
                contentTitle,
                contentUID,
                driveURL,
                contentCover
            }, {
                headers: { "Content-Type": "application/json" },
                timeout: 0
            })

            if (response.status === 201) {
                toggleMenu()
                dispatch("success", "Series added successfully!")
            } else {
                formError = response.data.error || "Failed to add series"
                console.error(formError)
            }
        } catch (error: any) {
            console.error("Error adding series:", error)
            formError = error.response?.data?.error || "Network error, please try again later"
        } finally {
            loading = false
        }
    }
</script>

<div class="importMenuContainter">
    <div class="importMenu">
        <div class="importTitle">
            <h2>Import Series from Google Drive</h2>
            <button on:click={toggleMenu} class="importButton">
                <Icon icon="material-symbols:close" width="2em" height="2em" style="color: #F46464" />
            </button>
        </div>
        <form class="importContent" on:submit={handleSubmit}>
            <p>Content Title</p>
            <input type="text" bind:value={contentTitle} placeholder="The Office - Complete Series" required>
            <p>Content UID</p>
            <input type="text" bind:value={contentUID} placeholder="unique-series-id" required>
            <p>Content URL</p>
            <input type="url" bind:value={driveURL} placeholder="https://drive.google.com/file/d/example-url/view?usp=drive_link" required>
            <p>Content Cover</p>
            <input type="url" bind:value={contentCover} placeholder="https://drive.google.com/file/d/poster-example-url/view?usp=drive_link" required>
            {#if formError}
                <p class="error">{formError}</p>
            {/if}
            {#if !loading}
                <input type="submit" value="Import">
            {:else}
                <button class="loadingButton">
                    <Icon icon="line-md:loading-twotone-loop" width="1.2em" height="1.2em" style="color: white" />
                </button>
            {/if}
        </form>
    </div>
</div>

<style>
    .importMenuContainter {
        position: fixed;
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

    .importMenu {
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

    @media (max-width: 800px) {
        .importMenu {
            width: 80%;
        }
    }
</style>
