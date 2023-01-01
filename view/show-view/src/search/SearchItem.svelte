<script>
  import { createEventDispatcher } from "svelte";
  import { fade } from "svelte/transition";
  import { i18n } from "../stores/i18n.js";
  import { formatDate } from "../stores/format-date.js";
  import SearchItemScore from "./SearchItemScore.svelte";
  import Tags from "../common/Tags.svelte";

  export let searchData;
  export let isLoading;

  const dispatch = createEventDispatcher();
  function navigateToQuestion(id, title) {
    if (!isLoading) {
      dispatch("gotoQuestion", {
        questionId: id,
        questionTitle: title
      });
    }
  }
</script>

<style>
  section {
    display: flex;
    margin-top: 12px;
    border-bottom: 1px solid var(--vscode-textSeparator-foreground);
    padding-bottom: 15px;
  }
  section:last-child {
    border: 0;
  }
  .information {
    width: 100%;
  }
  .information header {
    font-size: 18px;
    padding-top: 10px;
    font-weight: bold;
  }
  .information header:hover {
    color: var(--vscode-textLink-foreground);
    cursor: pointer;
  }
  .information-bottom {
    width: 100%;
  }
  .asked-info {
    text-align: right;
  }
  p {
    margin-top: 8px;
  }
  .is-loading {
    filter: blur(2px);
  }
  .is-loading header:hover {
    cursor: not-allowed;
  }
</style>

{#each searchData as searchItem, i}
<section in:fade class:is-loading={isLoading}>

  <SearchItemScore {searchItem} />

   <div class="information">

     <!-- svelte-ignore a11y-click-events-have-key-events -->
     <header on:click={() => navigateToQuestion(searchItem.questionId, searchItem.title)}>
       {@html searchItem.title}
     </header>

     <p>
       {@html searchItem.text.replace(/<\/?[^>]+(>|$)/g, '').substring(0, 350)}
       {#if searchItem.text.length > 350}...{/if}
     </p>

     <div class="information-bottom">
       <Tags tags={searchItem.tags} on:searchByTag />
       <div class="asked-info">
         {formatDate(searchItem.createdAtTime, $i18n, 'search')}
         {$i18n.text.by}
         <i>{searchItem.creatorName}</i>
       </div>
     </div>

   </div>

 </section>
{/each}
