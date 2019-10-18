<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>
<style scoped>
    #app {
        width: 100%;
        height: 100vh;
        background-color: rgba(245, 247, 249, 1);
        font-size: 14px;
    }
</style>
