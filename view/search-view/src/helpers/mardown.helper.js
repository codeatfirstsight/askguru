import MarkdownIt from 'markdown-it'

function markdownToHtml(markdownText) {
    let md = new MarkdownIt();
    return md.render(markdownText);
  }
  
  export { markdownToHtml }