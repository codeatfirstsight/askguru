<script>
	import { i18n, languages } from './stores/i18n.js';
  import { authStore, userNameStore } from "./stores/common.js";
  import QuestionAsk from "./question/QuestionAsk.svelte";
  import { onMount } from 'svelte';
  import { postMessage } from "./helpers/vscode-api.helper";
  import Loader from './common/Loader.svelte';
    import Header from './common/Header.svelte';
  let extensionAction;
  let messageEventRecieved = false;
  let userAuthenticated = false;

  /**
   * Posted properties on ask from extension.ts => showInputBox()
   * action: 'ask'
   * language: currentLanguageSelection, // user settings configuation
   */
  window.addEventListener("message", (event) => {
    messageEventRecieved = true;
    extensionAction = event.data.action;
    if (event.data.action === "ask") {
      authStore.set(event.data.accessToken);
      userNameStore.set(event.data.userName);
      // Set language
      $i18n = $languages.find((_) => _.language === event.data.language);
    } 
    userAuthenticated = $authStore;
  });

  onMount(() => {
    postMessage('onMount', "askView");
  })
</script>

{#if !messageEventRecieved}
  <Loader />
  {:else}
  <Header/>
  <QuestionAsk {userAuthenticated} />
{/if}


