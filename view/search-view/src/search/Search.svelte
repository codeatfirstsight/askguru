<script>
  import SearchInput from "./SearchInput.svelte";
  import ResultsBar from "../Common/ResultsBar.svelte";
  import SearchItem from "./SearchItem.svelte";
  import SearchNoResults from "./SearchNoResults.svelte";
  import SearchPager from "./SearchPager.svelte";
  import Loader from "../common/Loader.svelte";
  import { onMount } from "svelte";
  import { authStore } from '../stores/common'

  export let searchData;
  export let totalResults;
  export let isLoading;
  let userAuthenticated = false;
  export let paginatedData;

  onMount(()=> {
    userAuthenticated = $authStore;
  })
</script>

<SearchInput {userAuthenticated} {isLoading} on:searchInput />

<ResultsBar results={totalResults} {isLoading} {paginatedData} on:filterChange />

{#if isLoading}
  <Loader />
{/if}

{#if searchData && totalResults !== 0}
  <SearchItem {isLoading} {searchData} on:gotoQuestion on:searchByTag />
{:else if !isLoading}
  <SearchNoResults />
{/if}

<SearchPager {totalResults} on:searchByPage />
