<script>
  import { i18n } from "../stores/i18n.js";
  import { formatNumber, section } from "../stores/common.js";

  export let results;
  export let isLoading;
  export let paginatedData;

  $: total = formatNumber(results);
  $: title = $section === "search" ? $i18n.text.results : $i18n.text.answers;
  $: titleForNoResults =
    $section === "search" ? $i18n.text.no_results_found : $i18n.text.no_answers;

</script>

<style>
  section {
    border-bottom: 2px solid var(--vscode-textSeparator-foreground);
    display: flex;
    align-items: center;
  }
  div:first-of-type {
    width: 30%;
  }
  div:first-of-type header {
    margin: 10px 0;
    font-size: 16px;
  }
  div:last-of-type {
    width: 70%;
    text-align: right;
  }
  div:last-of-type span {
    margin-left: 16px;
    padding-bottom: 12px;
  }
</style>

<section>

  <div>
    <header>
      {#if results > 0}
        {#if $section === "search"}
            {paginatedData.fromRow}-{paginatedData.toRow} of {total} {title} 
          {:else}
            {total} {title}
        {/if}
      {:else if results === 0}{titleForNoResults}{:else if isLoading}&nbsp;{/if}
    </header>
  </div>

  <div>
    <span></span>
  </div>

</section>
