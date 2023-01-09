<script>
  import { i18n } from "../stores/i18n.js";
  import { section } from "../stores/common.js";
  import { createEventDispatcher } from "svelte";
  import { userNameStore } from "../stores/common";

  const dispatch = createEventDispatcher();
  export let userAuthenticated = false;
  function goBack() {
    dispatch("goBack");
  }
</script>

<style>
  h3 {
    font-weight: normal;
    color: var(--vscode-textLink-foreground);
    margin: 0;
  }
  .back {
    cursor: pointer;
  }
  .back span::before {
    border-style: solid;
    border-width: 2px 2px 0 0;
    content: "";
    display: inline-block;
    height: 0.45em;
    left: 0;
    position: relative;
    top: 6px;
    transform: rotate(-135deg);
    vertical-align: top;
    width: 0.45em;
    cursor: pointer;
  }
  
  .name-label {
    color: var(--vscode-textLink-foreground);
    margin-left: 0.2rem!important;
    display: block;
    margin-block-start: 0.1em;
    font-size: 12px;
    font-family: Roboto,Helvetica,Arial,sans-serif;
    font-weight: 400;
    line-height: 1.95;
    letter-spacing: .01071em;
  }

  .user_info {
    display: inline-flex;
    height: 25px;
  }

  .user__svg-icon {
    font-size: 20px;
    fill: currentColor;
  }

  .user__svg-icon-container {
    color: var(--vscode-icon-foreground);
    height: 25px;
    width: 25px;
  }

  small {
    color: var(--vscode-textLink-foreground);
    margin-left: 12px;
  }


</style>


<div style="display: flex; justify-content: space-between;margin-bottom: 30px;">
  {#if $section === 'question' || $section === 'tag'}
    <div class="back text-capitalize" on:keypress={goBack} on:click={goBack}>
      <span />
      {$i18n.text.back_to_search_results}
    </div>
  {:else}
  <h3 class="text-capitalize">
    Ask
    <strong>Guru</strong>
    {#if $i18n && $i18n.code !== ''}
      <small>
        <i>{$i18n.language}</i>
      </small>
    {/if}
  </h3>
  {/if}
  {#if $userNameStore && userAuthenticated}
    <div class="user_info">
      <div class="user__svg-icon-container">
        <svg class="user__svg-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
        </svg>
      </div>
      <span class="name-label">{$userNameStore}</span>
    </div>
  {/if}
</div>

