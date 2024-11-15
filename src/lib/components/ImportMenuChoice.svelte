<script lang="ts">
    import Icon from "@iconify/svelte"
    import DriveIcon from "$lib/assets/drive.svg"

    export let toggleMenu: () => void
    export let onSelect: (type: 'video' | 'series') => void
</script>

<div class="importMenuContainter">
    <div class="importMenu">
        <div class="importTitle">
            <h2>Select an Option</h2>
            <button on:click={toggleMenu} class="importButton">
                <Icon icon="material-symbols:close" width="2em" height="2em" style="color: #F46464" />
            </button>
        </div>
        <div class="importContent">
            <div> 
                <h2>Import Video</h2>
                <button class="driveButton" on:click={() => onSelect('video')}>
                    <img src={DriveIcon} width="25px" alt="Google Drive"> Import Video from Drive
                </button>
            </div>
            <div>
                <h2>Import Series</h2>
                <button class="driveButton" on:click={() => onSelect('series')}>
                    <img src={DriveIcon} width="25px" alt="Google Drive"> Import Series from Drive
                </button>
            </div>
        </div>
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
        gap: 0.3rem;
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

    .driveButton {
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 0.3rem;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-alternative);
        padding: 1rem;
        background: var(--red-primary-color);
        border: none;
        border-radius: 0.8rem;
        transition: 0.3s background;
    }

    .driveButton:hover {
        background: var(--red-secondary-color);
    }

    .importContent {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }

    .importContent div {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    @media (max-width: 800px) {
        .importMenu {
            width: 80%;
        }
    }
</style>
