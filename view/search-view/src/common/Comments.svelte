<script>
  import { fade } from "svelte/transition";
  import { i18n } from "../stores/i18n.js";
  import { formatDate } from "../stores/format-date.js";

  export let comments;
  let commentsShowAmount = 5;

  $: commentsLength = comments && comments.length - commentsShowAmount - 1;

  function toggleComments() {
    commentsShowAmount = commentsShowAmount === 5 ? comments.length : 5;
  }
</script>

<style>
  section {
    padding-bottom: 20px;
    margin-top: 15px;
  }
  .container {
    display: table;
    border-bottom: 1px solid var(--vscode-textSeparator-foreground);
    width: 100%;
  }
  .container:last-of-type {
    border-bottom: 0;
    margin-bottom: 10px;
  }
  .container .col {
    display: table-cell;
    padding: 10px 0px 10px 10px;
  }
  .container .col:first-child {
    text-align: center;
    width: 30px;
    vertical-align: middle;
  }
  .container .col:last-child {
    text-align: left;
    word-break: keep-all;
  }
  .display-name {
    background-color: var(--vscode-textLink-foreground);
    color: var(--vscode-badge-foreground);
    padding: 0 4px 1px;
    font-size: 11px;
    word-break: keep-all;
  }
  .highlight-score {
    color: var(--vscode-textLink-foreground);
  }
</style>

<section>

  {#each comments as comment, i}
    {#if i <= commentsShowAmount}
      <div class="container">
        <div class="col">
          <strong class:highlight-score={comment.totalVotes > 9}>
            {comment.totalVotes}
          </strong>
        </div>
        <div class="col">
          {@html comment.text}
          <i>
            &nbsp;&nbsp;–&nbsp;&nbsp
            <span class="display-name">{comment.creatorName}</span>
            &nbsp {formatDate(comment.createdAtTime, $i18n, 'generic')}
          </i>
        </div>
      </div>
    {/if}
  {/each}

  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <span class="link" on:click={toggleComments}>
    {#if comments.length > commentsShowAmount}
      {`${$i18n.text.show} ${commentsLength} ${$i18n.text.more_comments}`}
    {:else if comments.length === commentsShowAmount}
      {$i18n.text.hide_comments}
    {/if}
  </span>

</section>
