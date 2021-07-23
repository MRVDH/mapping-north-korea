<template>
    <v-main>
        <v-container
            id="content-container"
            fluid
            fill-height
            >
            <v-layout>
                <v-flex>
                    <CustomMap :key="componentKey" />
                </v-flex>
            </v-layout>
        </v-container>
        <CustomMenuRight />
    </v-main>
</template>

<script>
import CustomMap from '@/components/MapPage/CustomMap';
import CustomMenuRight from '@/components/MapPage/MenuRight';

export default {
    name: 'MapPage',
    components: {
        CustomMap,
        CustomMenuRight
    },
    data () {
        return {
            componentKey: 1
        };
    },
    computed: {
        darkMode () {
            return this.$store.state.darkMode;
        }
    },
    watch: {
        darkMode () {
            this.componentKey++;
        }
    }
};
</script>

<style scoped>
    #content-container {
        padding: 0;
    }
</style>
