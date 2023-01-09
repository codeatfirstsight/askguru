<script>
  export let score;
  export let isAccepted;
</script>

<style>
  h1 {
    margin: 0;
    font-size: 1.7rem;
  }
  .vote-up,
  .vote-down {
    width: 40px;
    height: 35px;
    margin: 0 auto;
    color: var(--vscode-icon-foreground);
  }
  .MuiSvgIcon-root {
    fill: currentColor;
  }

  .answer-tick {
    fill: #45a163;
    margin: 0 auto;
  }
</style>

<div class="vote-up">
  <svg class="MuiSvgIcon-root mlft2" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation" display="This question is useful">
    <path d="M7 14l5-5 5 5z"></path>
  </svg>
</div>
<h1>{score}</h1>
<div class="vote-down" style="margin-top: -2px;">
  <svg class="MuiSvgIcon-root mlft2" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation" display="This question is useful">
    <path d="M7 10l5 5 5-5z"></path>
  </svg>
</div>
{#if isAccepted}
  <svg
    aria-hidden="true"
    class="answer-tick"
    width="36"
    height="36"
    viewBox="0 0 36 36">
    <path d="M6 14l8 8L30 6v8L14 30l-8-8v-8z" />
  </svg>
{/if}
