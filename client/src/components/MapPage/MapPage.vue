<template>
    <v-content>
        <v-container id="content-container" fluid fill-height>
            <v-layout>
                <v-flex>
                    <CustomMap/>
                </v-flex>
            </v-layout>
        </v-container>
        <CustomMenuRight/>
    </v-content>
</template>

<script>
import CustomMap from '@/components/MapPage/CustomMap';
import CustomMenuRight from '@/components/MapPage/CustomMenuRight';

export default {
    name: 'MapPage',
    data () {
        return { };
    },
    components: {
        CustomMap,
        CustomMenuRight
    }
};
</script>

<style scoped>
    #content-container {
        padding: 0;
    }
</style>
