<template>
    <h1>Hello from test component</h1>
</template>
<script>
import { useApp } from '../store/app'

export default {
    props: {
        header: {
            type: String,
            default: null,
        },
        /**
         * Prop to override component's data method
         *
         * @type {object} data
         * @example
         {
             data:{
                 // check respective prop for more info
                 queries,
                 mutations,
                 fields,
                 crud,

                 // defines table header and values
                 mainHeaders: [
                    { text: 'ID', value: 'id' },
                    { text: 'Name', value: 'name' },
                    // value can accept functions to transform field values
                    { text: 'Type', value: (row)=>'Transformation:'+row.status },
                ],
             }
         }
         */
        data: {
            type: Object,
            default: () => ({}),
        },
        /**
         * Prop to pass on TableDataPagination's component
         *
         * Note: Defining queries prop inside data will ignore this property.
         * @example
         {
            queries:{
                // model name, will be used to find client/graphql/{Model}.js
                Branch: {
                    // method inside {Model}.js
                    method: 'branchSearch',
                },
            }
         }
         */
        queries: {
            type: Object,
            default: null,
        },
    },
    mounted() {
        console.log('test component mounted')
        useToast()
        useApp().test = true
    },
}
</script>
