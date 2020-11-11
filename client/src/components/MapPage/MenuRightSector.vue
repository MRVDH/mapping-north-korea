<template>
    <v-list
        class="pt-0 pb-0">
        <CustomMenuRightButtonState/>
        <CustomMenuRightSectorHelp/>
        <v-container
            grid-list-xs
            class="pa-4">
            <v-layout>
                <v-flex>
                    <CustomMenuRightButtonMap/>
                    <CustomMenuRightButtonView/>
                    <CustomMenuRightAdminButtons/>
                </v-flex>
            </v-layout>
        </v-container>
        <v-divider></v-divider>
        <CustomMenuRightSectorEvents/>
    </v-list>
</template>

<script>
import CustomMenuRightSectorEvents from './MenuRightSectorEvents';
import CustomMenuRightSectorHelp from './MenuRightSectorHelp';
import CustomMenuRightButtonMap from './MenuRightButtonMap';
import CustomMenuRightButtonView from './MenuRightButtonView';
import CustomMenuRightAdminButtons from './MenuRightAdminButtons';
import CustomMenuRightButtonState from './MenuRightButtonState';

export default {
    name: 'MenuRightSector',
    data () {
        return { };
    },
    components: {
        CustomMenuRightSectorEvents,
        CustomMenuRightSectorHelp,
        CustomMenuRightButtonMap,
        CustomMenuRightButtonView,
        CustomMenuRightAdminButtons,
        CustomMenuRightButtonState
    }
};
</script>

<style scoped>

</style>
