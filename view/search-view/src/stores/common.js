import { writable } from 'svelte/store';

const page = writable(1);
const section = writable("init");
const appConfigStore = writable();
const authStore = writable();
const userNameStore = writable();
const searchQuery = writable("");

function formatNumber(num) {
  if (Math.abs(num) > 999999) {
    return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + "m"
  } else if (Math.abs(num) > 999) {
    return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
  } else {
    return Math.sign(num) * Math.abs(num);
  }
};

export { page, section, formatNumber, searchQuery, authStore, userNameStore, appConfigStore }