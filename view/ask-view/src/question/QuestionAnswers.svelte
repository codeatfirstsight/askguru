<script>
  import { onMount, afterUpdate } from "svelte";
  import { i18n } from "../stores/i18n.js";
  import { vscodeProgress } from "../stores/vscode-api.js";
  import {getSanitizingConverter} from 'pagedown';
  import { uriSegments } from "../stores/static-models.js";
  import {
    selectedAnswerFilter,
    resultFilters
  } from "../stores/results-filter.js";
  import axios from "axios";
  import Comments from "../common/Comments.svelte";
  import RowLayout from "../common/RowLayout.svelte";
  import ResultsBar from "../Common/ResultsBar.svelte";
  import Loader from "../Common/Loader.svelte";
  import User from "../Common/User.svelte";
  import Tags from "../Common/Tags.svelte";
  import QuestionAnswerIndicies from "./QuestionAnswerIndicies.svelte";

  export let answers = [];
 
  afterUpdate(() => {
    hljs.initHighlightingOnLoad();
  })
  function convertMarkDownTextToHtml(markdownText) {
    let saneConv = getSanitizingConverter();
    return saneConv.makeHtml(markdownText);
  }

</script>

<style>
  section {
    border-bottom: 2px solid var(--vscode-textSeparator-foreground);
  }
  section:last-of-type {
    border-bottom: 0;
  }
  /* Duplicate styles from Questions.svelte */
  .question-answer-bottom {
    display: block;
    width: 100%;
    height: 82px;
  }
</style>

<ResultsBar
  results={answers.length} />

{#if answers}
  {#each answers as answer, i}
    <section>
      <RowLayout>

        <div slot="left">
          <QuestionAnswerIndicies
            score={answer.upVotes}
            isAccepted={answer.accepted} />
        </div>

        <div slot="right">
          <div>
            {@html convertMarkDownTextToHtml(answer.text)}
          </div>

          {#if answer.tags}
            <Tags tags={answer.tags} />
          {/if}

          <div class="question-answer-bottom">
            <User
                user={{link:"", profile_image:"", display_name:answer.creatorName, reputation:0}}
                createdDate={answer.createdAtTime}
                isQuestion={true} />
          </div>

          {#if answer.comments}
            <Comments comments={answer.comments} />
          {/if}
        </div>
      </RowLayout>
    </section>
  {/each}
{/if}
