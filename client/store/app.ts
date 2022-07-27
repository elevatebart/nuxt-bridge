import { defineStore } from 'pinia'

export const useApp = defineStore('app', {
    state: () => ({
        test: false,
    }),
})
