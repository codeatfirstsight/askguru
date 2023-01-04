import { writable } from 'svelte/store';

const authStore = writable();
const userNameStore = writable();


export {  authStore, userNameStore }