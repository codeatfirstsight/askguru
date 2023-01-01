<script>
	import { i18n, languages } from './stores/i18n.js';
  import { authStore } from "./stores/common.js";
  import { onMount } from "svelte";
  import QuestionAsk from "./question/QuestionAsk.svelte";
  let extensionAction;

  /**
   * Posted properties on search from extension.ts => showInputBox()
   * action: 'search', // or topPick
   * query: searchQuery, // inputbox value
   * language: currentLanguageSelection, // user settings configuation
   * sortType: currentSortTypeSelection // user settings configuation
   */
  window.addEventListener("message", (event) => {
    extensionAction = event.data.action;
    if (event.data.action === "ask") {
      authStore.set(event.data.accessToken);
      // Set language
      $i18n = $languages.find((_) => _.language === event.data.language);
    } 
  });

  onMount(() => {

  });
</script>
<QuestionAsk />
