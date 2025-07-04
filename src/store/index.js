// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    cartItems: []
  },
  mutations: {
    ADD_TO_CART(state, product) {
      const existingItem = state.cartItems.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }
    },
    REMOVE_FROM_CART(state, product) {
      state.cartItems = state.cartItems.filter(item => item.id !== product.id);
    },
    UPDATE_QUANTITY(state, { item, newQuantity }) {
      const cartItem = state.cartItems.find(cartItem => cartItem.id === item.id);
      if (cartItem) {
        cartItem.quantity = newQuantity;
      }
    },
    CLEAR_CART(state) {
      state.cartItems = [];
    }
  },
  actions: {
    addItemToCart({ commit }, product) {
      commit('ADD_TO_CART', product);
    },
    removeItemFromCart({ commit }, product) {
      commit('REMOVE_FROM_CART', product);
    },
    updateItemQuantity({ commit }, payload) {
      commit('UPDATE_QUANTITY', payload);
    },
    clearCart({ commit }) {  // Add this action
      commit('CLEAR_CART');
    }
  }
});