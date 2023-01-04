<script>
  import { onMount } from 'svelte';
  import { postMessage } from './helpers/vscode-api.helper'

  let activePane = "search";

  function searchQuestion() {
    activePane = "search";
    postMessage('searchQuestion', 'Opening search panel, please wait...');
  }
  function askQuestion() {
    activePane = "ask";
    postMessage('askQuestion', 'Opening ask question panel, please wait...');
  }

  onMount(()=> {
    searchQuestion();
  })
  
</script>

<style>

  .ripple-btn {
    position: relative;
    overflow: hidden;
    padding: 16px 32px;
  }

  .ripple-btn:after {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    width: 100%;
    height: 120px;
    margin-top: -60px;
    background: #2196f3;
    opacity: .4;

    transform: scale(0);
  }

  @keyframes ripple {
    0% {
      transform: scale(0);
    }
    20% {
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(1);
    }
  }

  .ripple-btn:not(:active):after {
    animation: ripple 1s ease-out;
  }

  /* fixes initial animation run, without user input, on page load.
  */
  .ripple-btn:after {
    visibility: hidden;
  }

  .ripple-btn:focus:after {
    visibility: visible;
  }

  
  .MuiList-root {
    margin: 0;
    padding: 0;
    position: relative;
    list-style: none;
  }

  .click {
    cursor: pointer !important;
  }

  .MuiListItem-root {
    width: 100%;
    display: flex;
    position: relative;
    box-sizing: border-box;
    text-align: left;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 8px;
    justify-content: flex-start;
    text-decoration: none;
  }

  .MuiButtonBase-root {
    color: inherit;
    border: 0;
    cursor: pointer;
    margin: 0;
    display: inline-flex;
    outline: 0;
    padding: 0;
    position: relative;
    align-items: center;
    user-select: none;
    border-radius: 0;
    vertical-align: middle;
    justify-content: center;
    text-decoration: none;
    background-color: transparent;
    -webkit-tap-highlight-color: transparent;
  }

  .activeMenu {
    border-right: 5px solid #2196f3 !important;
    background-color: #E8E8E8 !important;
    color: #2196f3 !important;
  }

  .MuiListItemIcon-root {
    color: rgba(0, 0, 0, 0.54);
    display: inline-flex;
    min-width: 56px;
    flex-shrink: 0;
  }

  .MuiSvgIcon-root {
    fill: currentColor;
    width: 1em;
    height: 1em;
    display: inline-block;
    font-size: 1.5rem;
    transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    flex-shrink: 0;
    user-select: none;
  }

  .activeIcon {
    color: #2196f3 !important;
  }

  .MuiListItemText-root {
    flex: 1 1 auto;
    min-width: 0;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .MuiTypography-body1 {
    font-size: 1rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.00938em;
  }

  .MuiTypography-root {
    margin: 0;
  }

  .MuiList-padding {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .MuiListItem-button {
    transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    padding-left: 5px;
  }

  .MuiListItem-gutters {
    padding-left: 16px;
    padding-right: 16px;
  }

</style>

<div>
  <ul class="MuiList-root click MuiList-padding">
    <div class="MuiButtonBase-root MuiListItem-root {activePane === 'search' ? "activeMenu" : ""} MuiListItem-gutters MuiListItem-button ripple-btn" tabindex="0"
         role="button" aria-disabled="false" on:click={searchQuestion} on:keypress={searchQuestion}>
      <div class="MuiListItemIcon-root">
        <svg class="MuiSvgIcon-root {activePane === 'search' ? "activeIcon" : ""}" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
        </svg>
      </div>
      <div class="MuiListItemText-root">
        <span class="MuiTypography-root MuiListItemText-primary MuiTypography-body1">Search</span>
      </div>
    </div>
    <div class="MuiButtonBase-root MuiListItem-root {activePane === 'ask' ? "activeMenu" : ""} MuiListItem-gutters MuiListItem-button ripple-btn" tabindex="0" role="button"
         aria-disabled="false" on:click={askQuestion} on:keypress={askQuestion}>
      <div class="MuiListItemIcon-root">
        <svg class="MuiSvgIcon-root {activePane === 'ask' ? "activeIcon" : ""}" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.75 7L14 3.25l-10 10V17h3.75l10-10zm2.96-2.96c.39-.39.39-1.02 0-1.41L18.37.29a.9959.9959 0 0 0-1.41 0L15 2.25 18.75 6l1.96-1.96z"></path>
          <path fill-opacity=".36" d="M0 20h24v4H0z"></path>
        </svg>
      </div>
      <div class="MuiListItemText-root">
        <span class="MuiTypography-root MuiListItemText-primary MuiTypography-body1">Ask Question</span>
      </div>
    </div>
  </ul>
</div>