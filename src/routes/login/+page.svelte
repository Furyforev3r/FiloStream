<script lang="ts">
    import Header from "$lib/components/Header.svelte"
    import Footer from "$lib/components/Footer.svelte"
    import FiloStream from "$lib/assets/FiloStream.png"
    import GoogleIcon from "$lib/assets/google.svg"
    import { goto } from "$app/navigation"
    import { user } from "$lib/client/hooks/loginState"
    import { loginWithGoogle } from "$lib/client/utils/firebaseUtils"
    import { afterUpdate } from "svelte"
    import axios from "axios"

    let userInfo

    $: userInfo = $user

    afterUpdate(() => {
        if (userInfo && userInfo != "Loading...") {
            goto("/")
        }
    })

    async function handleGoogleLogin() {
        const { success, user, error } = await loginWithGoogle()


        if (success) {
            try {
                const response = await axios.post('/api/login', {
                    'uid': user.uid,
                    'photoURL': user.photoURL,
                    'displayName': user.displayName.substring(0, 15),
                    'username': `${user.displayName.replace(/[^\w\s]/gi, '').replace(/\s+/g, '.').substring(0, 10).toLowerCase()}.${user.uid.substring(0, 5).toLowerCase()}`,
                    'email': user.email,
                    'emailVerified': user.emailVerified
                })

                if (response.status === 201 || response.status == 409) {
                    goto("/dashboard")
                }
            } catch (error) {
                console.error("Login error:", error)
            }
        }
    }
</script>

<svelte:head>
    <title>FiloStream - Login</title>
</svelte:head>

<div class="container">
    <Header />

    <main>
        <section>
        <img class="FiloStreamIcon" src={FiloStream} width="250px" alt="FiloStream.">
            <div class="FiloStream">
                <div>
                    <h1>FiloStream</h1>
                    <p>Stream all your favorite content quickly, easily and organized.</p>
                </div>
                <div class="divider"></div>
                <div>
                    <button on:click={handleGoogleLogin}><img src={GoogleIcon} width="25px" alt="Google"> Login with Google!</button>
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

    .FiloStreamIcon {
        cursor: pointer;
        transition: transform 0.3s;
    }

    .FiloStreamIcon:hover {
        transform: translateY(-3px);
    }

    .FiloStream {
        background: var(--button-background);
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        padding: 1rem;
        border-radius: 0.8rem;
    }

    .divider {
        align-self: center;
        width: 95%;
        padding: 1px;
        border-radius: 0.3rem;
        background: var(--red-secondary-color);
    }

    h1 {
        font-size: 32px;
    }

    button {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.3rem;
        cursor: pointer;
        background: none;
        padding: 1rem;
        border-radius: 999px;
        border: 0.2rem solid var(--focusBorder);
        color: var(--text-subdued);
        transition: 0.3s border-color;
        transition: 0.3s background;
    }

    button:hover {
        border-color: var(--foreground);
        background: var(--button-hover);
    }

    @media (max-width: 800px) {
        section {
            flex-direction: column;
            gap: 1rem;
        }
    }
</style>
