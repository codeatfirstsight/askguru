<script>
  import { vscodeInfo } from './helpers/vscode-api.helper'
  function test() {
    vscodeInfo('testing....')
  }
</script>

<div>
  <div>
    <button on:click={test}>Show Questions</button>
  </div>
  <div>
    <button>Ask Question</button>
  </div>
</div>