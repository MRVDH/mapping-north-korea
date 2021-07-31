<i18n>
{
    "en": {
        "help": {
            "login": "Please log in to map or edit this sector.",
            "change_back": "Please change the state to 'Being edited' to edit this sector."
        }
    },
    "ko": {
        "help": {
            "login": "이 부분의 지도를 제작하거나 편집하려면 로그인하세요.",
            "change_back": null
        }
    }
}
</i18n>

<template>
    <v-container
        text-center
        class="pa-4 pt-0"
        >
        <v-layout>
            <v-flex>
                <span
                    v-if="!loggedInUser"
                    class="orange--text"
                    >
                    {{ $t('help.login') }}
                </span>
                <span
                    v-if="loggedInUser && selectedSector.state.title === 'Completed'"
                    class="orange--text"
                    >
                    {{ $t('help.change_back') }}
                </span>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    name: 'MenuRightSectorHelp',
    data () {
        return { };
    },
    computed: {
        selectedSector () {
            return this.$store.state.selectedSector;
        },
        loggedInUser () {
            return this.$store.state.loggedInUser;
        }
    }
};
</script>

<style scoped>

</style>
