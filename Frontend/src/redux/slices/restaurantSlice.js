import { createSlice} from '@reduxjs/toolkit';
import { getRestaurants } from '../actions/restaurantAction';

const initialState={
    restaurants:[],
    conut:0,
    loading:false,
    error:null,
    showVegOnly:false,
    pureVegRestaurantCount:0,
}

const restaurantSlice= createSlice({
    name:"restaurants",
    initialState,
    reducers:{
        sortByRating:(state)=>{
            state.restaurants.sort((a,b)=> b.rating - a.rating)
        },
        sortByReviews:(state)=>{
            state.restaurants.sort((a,b)=> b.reviews - a.reviews)
        },
        toggleVegOnly:(state)=>{
            state.showVegOnly=!state.showVegOnly;
            state.pureVegRestaurantCount = calculatePureVegCount(state.restaurants,state.showVegOnly);
        },
        clearError:(state)=>{
            state.error=null;
        }
    },

    extraReducers:(builder)=>{
        builder
        //GET
        .addCase(getRestaurants.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getRestaurants.fulfilled,(state,action)=>{
            state.loading=false;
            state.restaurants=action.payload.restaurants;
            state.count=action.payload.count;
        })
        .addCase(getRestaurants.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload || "Failed to fetch restaurants";
        })
    }

})

export const {
    sortByRating,
    sortByReviews,
    toggleVegOnly,
    clearError,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;

//helper
const calculatePureVegCount=(restaurants,showVegOnly)=>{
    if(!showVegOnly) return restaurants.length;
    return restaurants.filter(restaurant => restaurant.isVeg).length;
}