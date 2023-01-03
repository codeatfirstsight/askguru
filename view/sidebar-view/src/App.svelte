<script>
  import { postMessage } from './helpers/vscode-api.helper'
  function searchQuestion() {
    postMessage('searchQuestion', 'Opening search panel, please wait...')
  }
  function askQuestion() {
    postMessage('askQuestion', 'Opening ask question panel, please wait...')
  }
</script>

<div>
  <div>
    <button on:click={searchQuestion}>Search</button>
  </div>
  <div>
    <button on:click={askQuestion}>Ask Question</button>
  </div>
</div>