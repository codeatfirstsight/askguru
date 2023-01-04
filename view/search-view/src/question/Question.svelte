<script>
  import { onMount, afterUpdate } from "svelte";
  import { changeWindowTitle, showProgress } from "../helpers/vscode-api.helper";
  import axios from "axios";
  import Comments from "../Common/Comments.svelte";
  import RowLayout from "../Common/RowLayout.svelte";
  import User from "../Common/User.svelte";
  import Tags from "../Common/Tags.svelte";
  import Loader from "../common/Loader.svelte";
  import QuestionTitle from "./QuestionTitle.svelte";
  import QuestionAnswers from "./QuestionAnswers.svelte";
  import QuestionIndices from "./QuestionIndices.svelte";
  import { authStore } from "../stores/common.js";
  import { markdownToHtml } from '../helpers/mardown.helper'
  export let questionId;
  export let questionTitle;
  export let gif;
  export let extensionAction;
  let question;
  let isLoading = true;
  let relatedQuestions;
  
  onMount(() => {
    fetchQuestion();
  });

  afterUpdate(() => {
    hljs.highlightAll();
  });

  function handleOnRelatedSearch(event) {
    isLoading = true;
    questionId = event.detail.questionId;
    questionTitle = event.detail.questionTitle;
    changeWindowTitle(questionTitle);
    fetchQuestion();
  }

  function fetchRelatedQuestions() {
    // isLoading = true;
    //
    // const site = `${$i18n.code}stackoverflow`;
    // const uri = `${uriSegments.baseUri}/questions/${questionId}/related?order=desc&sort=activity&site=${site}&filter=${uriSegments.relatedQuestionsFilter}&key=${uriSegments.key}`;
    //
    // axios.get(uri).then(response => {
    //   isLoading = false;
    //   if (response.status === 200) {
    //     relatedQuestions = response.data.items;
    //     showProgress("stop", null, false);
    //   } else {
    //     showProgress("stop", null, true);
    //   }
    // });
  }

  // function fetchQuestion() {
  //   showProgress("start", "Loading Search Results", false);
  //   const site = `${$i18n.code}stackoverflow`;
  //   const uri = `${uriSegments.baseUri}/questions/${questionId}?site=${site}&filter=${uriSegments.questionFilter}&key=${uriSegments.key}`;
  //
  //   axios.get(uri).then(response => {
  //     isLoading = false;
  //     if (response.status === 200) {
  //       question = response.data.items[0];
  //       fetchRelatedQuestions();
  //     } else {
  //       showProgress("stop", null, true);
  //     }
  //   });
  // }

  function fetchQuestion() {
    showProgress("start", "Loading Search Results", false);
    const authToken = $authStore;
    const qaboxUrl = `http://localhost:8088/public-api/open/questions/${questionId}`;
    let reqInstance = axios.create({
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    reqInstance
      .get(qaboxUrl)
      .then((response) => {
        isLoading = false;
        console.log(response)
        if (response.status === 200) {
          let responseBody = response.data;
          question = responseBody.results[0];
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

<style>
  .content {
    min-height: 90px;
  }
  .tags {
    margin-top: 20px;
  }
  .question-answer-bottom {
    display: block;
    width: 100%;
    height: 70px;
    margin-bottom: 30px;
  }
  .view-online {
    width: 100%;
    align-self: center;
  }
  .view-online a {
    cursor: pointer;
    float: left;
    margin-top: 38px;
  }
  iframe {
    min-height: 500px;
    min-width: 500px;
  }
</style>

{#if gif && question}
  <iframe src={gif} frameborder="0" title="haha" />
{/if}

<QuestionTitle
  on:relatedQuestionSearch={handleOnRelatedSearch}
  title={questionTitle}
  creationDate={question && question.createdAtTime}
  lastActivityDate={question && question.modifiedAtTime}
  viewCount={question && question.viewed}
  {relatedQuestions}
  {extensionAction} />

{#if isLoading}
  <Loader />
{/if}

{#if question}
  <RowLayout>

    <div slot="left">
      <QuestionIndices
        score={question.upVotes}
        favorite={question.viewed} />
    </div>

    <div slot="right">

      <div class="content">
        {@html markdownToHtml(question.text)}
      </div>

      {#if extensionAction !== 'topPick'}
        <div class="tags">
          <Tags tags={question.tags} on:searchByTag />
        </div>
      {/if}

      <div class="question-answer-bottom">
<!--        <div class="view-online">-->
<!--          <a href={question.link} target="_blank">{$i18n.text.view_online}</a>-->
<!--        </div>-->

       <User
         user={{link:"", profile_image:"", display_name:question.creatorName, reputation:0}}
         createdDate={question.createdAtTime}
         isQuestion={true} />
      </div>

      <!--{#if question.closed_details}-->
      <!--  <QuestionClosed-->
      <!--    details={question.closed_details}-->
      <!--    reason={question.closed_reason}-->
      <!--    closedDate={question.closed_date} />-->
      <!--{/if}-->

      <!--{#if question.notice}-->
      <!--  <QuestionNotice notice={question.notice} />-->
      <!--{/if}-->

      {#if question.comments}
       <Comments comments={question.comments} />
      {/if}
    </div>

  </RowLayout>

  {#if question.answers.length > 0}
    <QuestionAnswers answers={question.answers} />
  {/if}
{/if}
