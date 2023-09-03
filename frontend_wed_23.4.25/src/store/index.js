import{ createStore }from "vuex"

const store = createStore({
    state:{
        hospitalID:"5b049cc861ea50e507a396124a50aeb6"
    },
    mutations:{
        setHospitalID(state,hospitalID){
            state.hospitalID=hospitalID
        }
    }
})

export  default store;