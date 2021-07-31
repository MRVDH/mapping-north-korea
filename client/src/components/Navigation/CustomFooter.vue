<template>
    <v-footer
        app
        class="pa-3"
        >
        <v-spacer />
        <div>&copy; www.mappingnorthkorea.com {{ new Date().getFullYear() }}</div>
    </v-footer>
</template>

<script>
export default {
    name: 'CustomFooter',
    data () {
        return { };
    }
};
</script>

<style></style>
