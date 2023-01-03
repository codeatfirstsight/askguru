function formatNumber(num) {
    if (Math.abs(num) > 999999) {
      return Math.sign(num) * (Math.abs(num) / 1000000).toFixed(1) + "m"
    } else if (Math.abs(num) > 999) {
      return Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    } else {
      return Math.sign(num) * Math.abs(num);
    }
  };

  function questionData() {
    return `I would like to trigger the appearance of a text after pressing a button for each user individually,The objective is that if you press the button of a specific user, the text will appear only for this one and not for the others. Unfortunately my code does not work. When I click on the button the text appears for all users. How can I do it?

    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
      <div class="card">
          <div class="card-body">
              <div style="padding-top: 90px; padding-left: 30px;">
                  <div class="user_style2">
                      <div class="col-xs-6 col-sm-6 col-md-6 col-lg-3">
                          <div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">
    
                              <p>install_id</p>
                              <p>branch_id</p>
                          </div>
                          <button onclick="hiddenButton()">Try it</button>
    
                          <div class="DIV" name="DIV">
                              This is my DIV element.
                          </div>
                         
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
    
    <?php
                    }
                    // End the foreach loop 
               ?>
    
    <script>
      function hiddenButton() {
          var x = document.getElementsByClassName("DIV");
          
          for (i = 0; i < x.length; i++)
              if (x[i].style.display === "none") {
                  x[i].style.display = "block";
              } else {
                  x[i].style.display = "none";
              }
      }
    </script>
    </body>
    `
  }

  export { formatNumber, questionData }