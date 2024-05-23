<script>
    import "@appwrite.io/pink"; 
    import "@appwrite.io/pink-icons";
</script>

<main>
    <slot />
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-height: 100vh;
        width: 100vw;
        background-color: hsl(var(--color-neutral-90));
        color: hsl(var(--color-neutral-10));
    }
</style>