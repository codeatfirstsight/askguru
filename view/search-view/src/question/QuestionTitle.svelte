<script>
  import { fade } from "svelte/transition";
  import { i18n } from "../stores/i18n.js";
  import { formatNumber } from "../stores/common.js";
  import { timeAgo } from "../stores/format-date.js";

  export let title;
  export let creationDate;
  export let lastActivityDate;
  export let viewCount;

  $: totalViews = formatNumber(viewCount);

</script>

<style>
  .question-title-container {
    border-bottom: 2px solid var(--vscode-textSeparator-foreground);
    padding: 6px 0;
  }
  h1 {
    margin: 6px 0;
    word-break: break-word;
  }
  .metrics {
    margin-top: 10px;
    height: 22px;
  }
  .metrics span:not(:last-of-type) {
    margin-right: 20px;
    font-weight: bold;
  }
</style>

<h1>
  {@html title}
</h1>

<div class="question-title-container" in:fade>
  <div class="metrics">

    {#if creationDate}
      {$i18n.text.asked}
      <span>{timeAgo(creationDate, $i18n)}</span>
    {/if}
    {#if lastActivityDate}
      {$i18n.text.active}
      <span>{timeAgo(lastActivityDate, $i18n)}</span>
    {/if}
    {#if totalViews}
      {$i18n.text.viewed}
      <span>{totalViews} {$i18n.text.times}</span>
    {/if}
  </div>
</div>
