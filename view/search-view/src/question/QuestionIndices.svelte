<script>
  export let score;
  export let favorite;
</script>

<style>
  h1 {
    font-size: 1.7rem;
    margin: 0;
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

  small {
    opacity: 0.5;
    font-size: 1rem;
  }
  .star-score {
    margin-left: -5px;
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
{#if favorite > 0}
  <small class="star">★</small>
  <br />
  <small class="star-score">{favorite}</small>
{/if}
