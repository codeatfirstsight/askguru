import { writable } from 'svelte/store';

const authStore = writable();
const userNameStore = writable();
const appConfigStore = writable();


export {  authStore, userNameStore, appConfigStore }