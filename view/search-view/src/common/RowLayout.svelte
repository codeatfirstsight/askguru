<style>
  .container {
    display: flex;
    width: 100%;
  }
  .container .col {
    padding: 10px 0px 10px 10px;
  }
  .container .col:first-child {
    text-align: center;
    width: 10%;
    padding-top: 18px;
  }
  .container .col:last-child {
    text-align: left;
    word-break: keep-all;
    width: 90%;
  }
  @media screen and (max-width: 765px) {
    .container .col:first-child {
      display: none;
      padding: 0;
    }
  }
</style>

<div class="container">
  <div class="col">
    <slot name="left" />
  </div>
  <div class="col">
    <slot name="right" />
  </div>
</div>
