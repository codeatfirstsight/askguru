
<script>
  import { uriSegments } from "./stores/static-models.js";
  import { languages, i18n } from "./stores/i18n.js";
  import { page, section, searchQuery, authStore } from "./stores/common.js";
  import { showProgress, changeWindowTitle, postMessage } from "./helpers/vscode-api.helper";
  import {
    selectedSearchFilter,
    resultFilters,
  } from "./stores/results-filter.js";
  import axios from "axios";
  import Header from "./common/Header.svelte";
  import Question from "./question/Question.svelte";
  import Search from "./search/Search.svelte";
  import Tag from "./tag/tag.svelte";
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

  /**
   * Posted properties on search from extension.ts => showInputBox()
   * action: 'search', // or topPick
   * query: searchQuery, // inputbox value
   * language: currentLanguageSelection, // user settings configuation
   * sortType: currentSortTypeSelection // user settings configuation
   */
  window.addEventListener("message", (event) => {
    messageEventRecieved = true;
    extensionAction = event.data.action;
    if (event.data.action === "init") {
      console.log('addEventListener', event)
      isLoading = false;
      authStore.set(event.data.accessToken);
      userAuthenticated = $authStore;
      // Set language
      $i18n = $languages.find((_) => _.language === event.data.language);
      // Find & set sort filter
      const searchFilterToSetAsSelected = resultFilters.find(
        (_) => _.label === event.data.sortType
      );
      selectedSearchFilter.set(searchFilterToSetAsSelected);
      // Set section
      section.set("init");
    }
    else if (event.data.action === "search") {
      authStore.set(event.data.accessToken);
      userAuthenticated = $authStore;
      searchQuery.set(event.data.query);
      // Set language
      $i18n = $languages.find((_) => _.language === event.data.language);
      // Find & set sort filter
      const searchFilterToSetAsSelected = resultFilters.find(
        (_) => _.label === event.data.sortType
      );
      selectedSearchFilter.set(searchFilterToSetAsSelected);
      // Set section
      section.set("search");

      search();
    }
  });

  onMount(() => {
    postMessage('onMount', "searchView");
    if(!$section || !$selectedSearchFilter || !messageEventRecieved) {
      $i18n = $languages[0];
      const searchFilterToSetAsSelected = resultFilters.find(
        _ => _.label === 'Newest'
      );
      selectedSearchFilter.set(searchFilterToSetAsSelected);
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

  function handleFilterChangeSearch() {
    page.set(1);
    !selectedTag ? search() : tagSearch(selectedTag);
  }

  function handleTagFromQuestionSearch(event) {
    section.set("search");
    handleTagSelected(event);
  }

  // Search by selected tag - Only gets the wiki info -
  // Full search still needs to be done based on tag name with added property &tagged= to uri
  function handleTagSelected(event) {
    showProgress("start", "Loading Tag Results", false);
    isLoading = true;
    window.scroll({ top: 0, behavior: "smooth" });
    selectedTag = event.detail.tag;
    page.set(1);

    const site = `${$i18n.code}stackoverflow`;
    const uri = `${uriSegments.baseUri}/tags/${selectedTag}/wikis?site=${site}&filter=${uriSegments.tagFilter}&key=${uriSegments.key}`;

    axios
      .get(uri)
      .then((response) => {
        if (response.status === 200) {
          tagData = response.data.items[0];
          tagSearch(selectedTag);
        } else {
          isLoading = false;
          showProgress("stop", null, true);
        }
      })
      .catch(() => {
        isLoading = false;
        showProgress("stop", null, true);
      });
  }

  function tagSearch(selectedTag) {
    isLoading = true;
    changeWindowTitle(`[${selectedTag}]`);
    searchQuery.set(`[${selectedTag}]`);

    const site = `${$i18n.code}stackoverflow`;
    const uri = `${uriSegments.baseUri}/search/advanced?tagged=${selectedTag}&page=${$page}&pagesize=10&order=${$selectedSearchFilter.apiOrder}&sort=${$selectedSearchFilter.apiSort}&site=${site}&filter=${uriSegments.searchFilter}&key=${uriSegments.key}`;

    axios
      .get(uri)
      .then((response) => {
        isLoading = false;
        if (response.status === 200) {
          searchData = response.data.items;
          totalResults = response.data.total;
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

    const site = `${$i18n.code}stackoverflow`;
    const uri = `${uriSegments.baseUri}/search/advanced?q=${$searchQuery}&page=${$page}&pagesize=10&order=${$selectedSearchFilter.apiOrder}&sort=${$selectedSearchFilter.apiSort}&site=${site}&filter=${uriSegments.searchFilter}&key=${uriSegments.key}`;
    const authToken = $authStore;
    const qaboxUrl = "http://localhost:8088/public-api/open/component/generate";
    const requestBody = {
      config: { 
        type: "SEARCH_QUESTIONS", 
        components: ["SEARCH_BY_TEXT"] 
      },
      inputParams: { searchText: $searchQuery },
    };
    let reqInstance = axios.create({
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    reqInstance
      .post(qaboxUrl, requestBody)
      .then((response) => {
        isLoading = false;
        console.log(response)
        if (response.status === 200) {
          let responseBody = response.data;
          searchData = responseBody.data['SEARCH_BY_TEXT'].results;
          totalResults = searchData ? searchData.length : 0;
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
    <Header on:goBack={handleGotoSearch} {extensionAction} />
    {#if $section === "init"}
      <SearchInput {userAuthenticated} isLoading={false} initialSearch={true} on:searchInput={initSearch} />
    {/if}
    {#if $section === "search"}
      <Search
        on:gotoQuestion={handleGotoQuestion}
        on:gotoTagLearnMore={() => section.set("tag")}
        on:searchByTag={handleTagSelected}
        on:searchInput={searchFromSearchInput}
        on:searchByPage={handlePageSearch}
        on:filterChange={handleFilterChangeSearch}
        {isLoading}
        {searchData}
        {tagData}
        {totalResults}
      />
    {:else if $section === "question"}
      <Question
        on:searchByTag={handleTagFromQuestionSearch}
        {questionId}
        {questionTitle}
        {extensionAction}
        {gif}
      />
    {:else if $section === "tag"}
      <Tag {tagData} />
    {/if}
{/if}
