      <!-- Footer -->
      <div id="footer" class="container">

        <div class="row">
          <div class="12u">
            <ul class="icons">
              <li><a href="mailto:norcast@online.no" class="icon fa-envelope"><span>EMail</span></a></li>
              <li><a href="tel:+47 909 10 336" class="icon fa-phone"><span>Phone</span></a></li>
            </ul>
            <span class="copyright">
              &copy; 2006 and ongoing - NorCast/AluServices as.<br />
              <?php
                if (isset($_GET['page']))
                {
                  $page = $_GET['page']; 
                  if ($page == "0" || $page == "1" || !$page)
                  {
                    echo "Above Photo of Arendal by Svein Bjerkholdt<br />";
                  }
                }
                else
                  { echo "Above Photo of Arendal by Svein Bjerkholdt<br />"; }
              ?>
              </span>
          </div>
        </div>
