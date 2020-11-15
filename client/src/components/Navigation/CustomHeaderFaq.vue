<i18n>
{
    "en": {
        "faq": {
            "head": "New to mappingnorthkorea.com?",
            "subtitle": "Read some frequently asked questions here.",

            "q1": {
                "question": "What is this?",
                "answer": "This is MappingNorthKorea.com, a collaborative effort to map one of the most isolated countries on earth. Read more on the about page {0}.",
                "link": "here"
            },
            "q2": {
                "question": "Why are all the buttons disabled?",
                "answer": "You probably haven't logged in yet. You can browse sectors without an account, but to map you will need an OpenStreetMap account. If you don't have one, sign up {0}. If you have an account, open the left menu by pressing the three-lined-button in the top left corner and click the login button. If only the Map button is disabled but the edit button is clickable, then the sector is probably not in an editable state. Check the question below.",
                "link": "here"
            },
            "q3": {
                "question": "Why is the Map button disabled?",
                "answer": "The sector that you selected is probably not in an editable state. Use the Edit button to switch the sector to Being edited. If the edit button is disabled then you are probably not logged in yet. Check the question above."
            },
            "q4": {
                "question": "The sector I am editing is too much work or too big. How do I split a sector into smaller sectors?",
                "answer": "To avoid abuse of the system currently only people whom have administrator rights are allowed to do this. Please send an email to {0} for a split request and include the sector id. The sector id can be found after selecting a sector.",
                "link": "info@maartenvandenhoven.com"
            },
            "q5": {
                "question": "Where can I contribute code or report bugs and enhancements?",
                "answer": "There is a public GitHub repository {0} where you can contribute either by writing code or by reporting bugs and enhancements. If you don't have a GitHub account or with to quickly send me a message about a bug or enhancement you can send me an email at the email address above.",
                "link": "here"
            },
            "q6": {
                "question": "Why does the JOSM map option give an error?",
                "answer": "For some reason the website can't connect with your JOSM instance. Is JOSM running and is Remote Contol enabled? You can enable this in the settings of JOSM."
            },
            "q7": {
                "question": "What should I map?",
                "answer": "The iteration name in the header will tell you what needs to be mapped in this iteration. At the time of writing it's roads."
            },

            "confirm": "Got it"
        }
    },
    "ko": {
        "faq": {
            "head": "mappingnorthkorea.com이 처음이세요?",
            "subtitle": "자주 묻는 질문들을 읽어요.",

            "q1": {
                "question": null,
                "answer": null,
                "link": null
            },
            "q2": {
                "question": null,
                "answer": null,
                "link": null
            },
            "q3": {
                "question": null,
                "answer": null
            },
            "q4": {
                "question": null,
                "answer": null,
                "link": null
            },
            "q5": {
                "question": null,
                "answer": null,
                "link": null
            },
            "q6": {
                "question": null,
                "answer": null
            },
            "q7": {
                "question": null,
                "answer": null
            },

            "confirm": "알겠습니다"
        }
    }
}
</i18n>

<template>
    <div>
        <v-btn icon @click.stop="infoDialog = true">
            <v-icon>help_outline</v-icon>
        </v-btn>
        <v-dialog v-model="infoDialog" max-width="700px">
            <v-card id="info-dialog">
                <v-card-title>
                    <h1>{{ $t('faq.head') }}</h1>
                    {{ $t('faq.subtitle') }}
                </v-card-title>
                <v-card-text>
                    <h3>{{ $t('faq.q7.question') }}</h3>
                    <p>{{ $t('faq.q7.answer') }}</p>

                    <h3>{{ $t('faq.q1.question') }}</h3>
                    <i18n path="faq.q1.answer" tag="p">
                        <a href="/about" @click.stop="infoDialog = false" target="_blank">{{ $t('faq.q1.link') }}</a>
                    </i18n>

                    <h3>{{ $t('faq.q2.question') }}</h3>
                    <i18n path="faq.q2.answer" tag="p">
                        <a href="https://www.openstreetmap.org/user/new" @click.stop="infoDialog = false" target="_blank">{{ $t('faq.q2.link') }}</a>
                    </i18n>

                    <h3>{{ $t('faq.q3.question') }}</h3>
                    <p>{{ $t('faq.q3.answer') }}</p>

                    <h3>{{ $t('faq.q4.question') }}</h3>
                    <i18n path="faq.q4.answer" tag="p">
                        <a href="mailto:info@maartenvandenhoven.com" @click.stop="infoDialog = false" target="_blank">{{ $t('faq.q4.link') }}</a>
                    </i18n>

                    <h3>{{ $t('faq.q5.question') }}</h3>
                    <i18n path="faq.q5.answer" tag="p">
                        <a href="https://github.com/MRVDH/mapping-north-korea" @click.stop="infoDialog = false" target="_blank">{{ $t('faq.q5.link') }}</a>
                    </i18n>

                    <h3>{{ $t('faq.q6.question') }}</h3>
                    <p>{{ $t('faq.q6.answer') }}</p>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined @click.stop="infoDialog = false">{{ $t('faq.confirm') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: 'CustomHeaderFaq',
    data () {
        return {
            infoDialog: false
        };
    }
};
</script>

<style>
    #info-dialog a {
        color: #6baff3;
    }
</style>
