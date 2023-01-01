<script>

  import { i18n } from "../stores/i18n.js";

  export let searchItem;

  function findAcceptedAnswer(searchItem) {
    return searchItem.answers.find(answer => answer.accepted);
  }

  function hasAcceptedAnswer(searchItem) {
    let accpetedAns = findAcceptedAnswer(searchItem);
    return  accpetedAns ? accpetedAns.accepted : false; 
  }
</script>

<style>
  section {
    text-align: center;
    float: left;
    width: 80px;
    margin: 0 22px;
  }
  section div {
    padding: 10px;
  }
  section h3 {
    margin: 0;
  }
  .answer-count.is-answered {
    border: 1px solid var(--vscode-textLink-foreground);
    color: var(--vscode-textLink-foreground);
    font-weight: bold;
    border-radius: 2px;
  }
  .answer-count.is-answered-full {
    background-color: var(--vscode-textLink-foreground);
    color: var(--vscode-button-foreground);
    font-weight: bold;
    border-radius: 2px;
  }
  @media screen and (max-width: 765px) {
    section {
      margin: 0 22px 0 0;
    }
  }
</style>

<section>
  <div>
    <h3>{searchItem.upVotes}</h3>
    <small>
      {#if searchItem.upVotes === 1}
        {$i18n.text.vote}
      {:else}{$i18n.text.votes}{/if}
    </small>
  </div>
  <div
    class="answer-count"
    class:is-answered={hasAcceptedAnswer(searchItem)}
    class:is-answered-full={hasAcceptedAnswer(searchItem)}>
    <h3>{searchItem.answers.length}</h3>
    <small>
      {#if searchItem.answers.length === 1}
        {$i18n.text.answer}
      {:else}{$i18n.text.answers}{/if}
    </small>
  </div>
</section>
