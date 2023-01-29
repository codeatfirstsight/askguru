
<script>
  import { languages, i18n } from "./stores/i18n.js";
  import { page, section, searchQuery, authStore, userNameStore, appConfigStore } from "./stores/common.js";
  import { showProgress, changeWindowTitle, postMessage } from "./helpers/vscode-api.helper";
  import axios from "axios";
  import Header from "./common/Header.svelte";
  import Question from "./question/Question.svelte";
  import Search from "./search/Search.svelte";
  import { onMount } from "svelte";
  import SearchInput from "./search/SearchInput.svelte";
  import Loader from "./common/Loader.svelte";

  let searchData;
  let questionId;
  let questionTitle;
  let totalResults;
  let isLoading = true;
  let extensionAction;
  let selectedTag;
  let tagData;
  let gif;
  let messageEventRecieved = false;
  let userAuthenticated = false;
  let paginatedData;

  /**
   * Posted properties on search from extension.ts => showInputBox()
   * action: 'search', // or topPick
   * query: searchQuery, // inputbox value
   * language: currentLanguageSelection, // user settings configuation
   * sortType: currentSortTypeSelection // user settings configuation
   */
  window.addEventListener("message", (event) => {
    extensionAction = event.data.action;
    if (event.data.action === "init") {
      isLoading = false;
      authStore.set(event.data.accessToken);
      userNameStore.set(event.data.userName);
      appConfigStore.set(event.data.appConfig);
      userAuthenticated = $authStore;
      // Set language
      $i18n = $languages.find((_) => _.language === event.data.language);
      // Set section
      section.set("init");
      messageEventRecieved = true;
    }
    else if (event.data.action === "search") {
      authStore.set(event.data.accessToken);
      userNameStore.set(event.data.userName);
      appConfigStore.set(event.data.appConfig);
      userAuthenticated = $authStore;
      searchQuery.set(event.data.query);
      // Set language
      $i18n = $languages.find((_) => _.language === event.data.language);
      // Set section
      section.set("search");
      messageEventRecieved = true;

      search();
    }
  });

  onMount(() => {
    postMessage('onMount', "searchView");
    if(!$section || !messageEventRecieved) {
      $i18n = $languages[0];
    }
  });

  function handleGotoQuestion(event) {
    section.set("question");
    changeWindowTitle(event.detail.questionTitle);
    questionId = event.detail.questionId;
    questionTitle = event.detail.questionTitle;
  }

  function handleGotoSearch(event) {
    section.set("search");
    changeWindowTitle($searchQuery);
  }

  function handlePageSearch() {
    if (!selectedTag) {
      window.scroll({ top: 80, behavior: "smooth" });
      search();
    } else {
      window.scroll({ top: 0, behavior: "smooth" });
      tagSearch(selectedTag);
    }
  }

  // Main search functionality

  function initSearch() {
    section.set("search");
    changeWindowTitle($searchQuery);
    search();
  }

  function searchFromSearchInput() {
    changeWindowTitle($searchQuery);
    search();
  }

  function search() {
    if (
      $searchQuery[0] === "[" &&
      $searchQuery[$searchQuery.length - 1] === "]"
    ) {
      const tag = $searchQuery.substring(1, $searchQuery.length - 1);
      handleTagSelected({ detail: { tag: tag } }); // (o.0)
      return;
    }
    showProgress("start", "Loading Search Results", false);
    isLoading = true;
    tagData = null;
    selectedTag = null;

    const authToken = $authStore;
    const apiBaseUrl = $appConfigStore.apiBaseUrl;
    const qaboxUrl = `${apiBaseUrl}/public-api/open/component/generate`;
    const requestBody = {
      config: { 
        type: "SEARCH_QUESTIONS", 
        components: ["SEARCH_BY_TEXT"] 
      },
      inputParams: { 
        searchText: $searchQuery,
        paginationRequest: {
          currentPage: $page,
          pageSize: 10 
        }
      },
    };
    let reqInstance = axios.create({
      headers: {
        authorization: `Bearer ${authToken}`,
      },
    });

    reqInstance
      .post(qaboxUrl, requestBody)
      .then((response) => {
        isLoading = false;
        console.log(response)
        if (response.status === 200) {
          let responseBody = response.data;
          paginatedData = responseBody.data['SEARCH_BY_TEXT'].paginatedData;
          searchData = paginatedData.results;
          totalResults = paginatedData.totalRows;
          showProgress("stop", null, false);
        } else {
          showProgress("stop", null, true);
        }
      })
      .catch(() => {
        isLoading = false;
        showProgress("stop", null, true);
      });
  }
</script>

{#if !messageEventRecieved}
  <Loader />
  {:else}
    <Header on:goBack={handleGotoSearch} {extensionAction} {userAuthenticated} />
    {#if $section === "init"}
      <SearchInput {userAuthenticated} isLoading={false} initialSearch={true} on:searchInput={initSearch} />
    {/if}
    {#if $section === "search"}
      <Search
        on:gotoQuestion={handleGotoQuestion}
        on:searchInput={searchFromSearchInput}
        on:searchByPage={handlePageSearch}
        {isLoading}
        {searchData}
        {tagData}
        {totalResults}
        {paginatedData}
      />
    {:else if $section === "question"}
      <Question
        {questionId}
        {questionTitle}
        {extensionAction}
        {gif}
      />
    {/if}
{/if}

