<template>
    <v-container>
        <h1>INDEX</h1>
        <v-card class="mx-auto" max-width="344">
            <v-card-text>
                <div>Example Vuetify Card</div>
                <p class="text-h4 text--primary">el·ee·mos·y·nar·y</p>
                <p>adjective</p>
                <div class="text--primary">
                    relating to or dependent on charity; charitable.
                    <br />
                    "an eleemosynary educational institution."
                </div>
            </v-card-text>
            <v-card-actions>
                <v-btn text color="teal accent-4" @click="reveal = true">Learn More</v-btn>
            </v-card-actions>

            <v-expand-transition>
                <v-card v-if="reveal" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%">
                    <v-card-text class="pb-0">
                        <p class="text-h4 text--primary">Origin</p>
                        <p>
                            late 16th century (as a noun denoting a place where alms were distributed): from
                            medieval Latin eleemosynarius, from late Latin eleemosyna ‘alms’, from Greek
                            eleēmosunē ‘compassion’
                        </p>
                    </v-card-text>
                    <v-card-actions class="pt-0">
                        <v-btn text color="teal accent-4" @click="reveal = false">Close</v-btn>
                    </v-card-actions>
                </v-card>
            </v-expand-transition>
        </v-card>
        <v-btn
            class="justify-center mt-16"
            x-large
            dark
            outlined
            color="green"
            @click="$router.push('/composition')"
        >
            Go to page with script setup tag
        </v-btn>
    </v-container>
</template>

<script>
export default {
    name: 'Home',
    data: () => ({
        reveal: false,
    }),
}
</script>
