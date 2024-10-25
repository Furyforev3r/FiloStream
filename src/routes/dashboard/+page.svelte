<script lang="ts">
    import Icon from "@iconify/svelte"
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import { goto } from "$app/navigation"
    import { user } from "$lib/client/hooks/loginState"
    import { afterUpdate } from "svelte"
    
    let userInfo

    $: userInfo = $user

    afterUpdate(() => {
        if (!userInfo && userInfo != "Loading...") {
            goto("/login")
        }
    })
</script>

<svelte:head>
    <title>FiloStream - Dashboard</title>
    <meta name="description" content="Filo Stream." />
</svelte:head>

<div class="container">
    <Header />

    <main>
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
</style>
