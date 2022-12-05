import {createStore} from 'vuex'

const store = createStore({
    state(){
        return {
            game: "introScene"
        }
    },
    mutations: {
        changeScene (state, payload){
            state.game = payload.scene
        }
    }
})

export default store;




