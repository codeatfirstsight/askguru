<script>
  import { afterUpdate } from "svelte";
  import Comments from "../common/Comments.svelte";
  import RowLayout from "../common/RowLayout.svelte";
  import ResultsBar from "../Common/ResultsBar.svelte";
  import User from "../Common/User.svelte";
  import Tags from "../Common/Tags.svelte";
  import QuestionAnswerIndicies from "./QuestionAnswerIndicies.svelte";
  import { markdownToHtml } from '../helpers/mardown.helper'

  export let answers = [];
 
  afterUpdate(() => {
    hljs.highlightAll();
  })

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
            score={answer.totalVotes}
            isAccepted={answer.accepted} />
        </div>

        <div slot="right">
          <div>
            {@html markdownToHtml(answer.text)}
          </div>

          {#if answer.tags}
            <Tags tags={answer.tags} />
          {/if}

          <div class="question-answer-bottom">
            <User
                user={{link:"", profile_image:"", display_name:answer.creatorName, reputation:0}}
                createdDate={answer.createdAtTime}
                isQuestion={false} />
          </div>

          {#if answer.comments}
            <Comments comments={answer.comments} />
          {/if}
        </div>
      </RowLayout>
    </section>
  {/each}
{/if}
