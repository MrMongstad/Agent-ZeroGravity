	<!-- Header -->
	<div id="header">
	  <div class="container">

		<!-- Logo -->
		<div id="logo">
		  <div>
			<h1>NorCast<span class="em2">®</span><span class="head">2026</span></h1>
			<h2>19th Nordic Aluminium Casthouse Conference</h2>
		  </div>
		</div>

		<!-- Nav -->
		<?php
		if (isset($_GET["page"])) {
		  $page = $_GET["page"];
		}
		else
		{ $page = 1; }
		?>
		<nav id="nav">
		  <ul>
			<li<?php if ($page == 1 || !$page) { ?> class="current_page_item"<?php } ?>><a href="./">Home</a></li>
			<li<?php if ($page == 2 || $page == 3 || $page == 4 || $page == 5 || $page == 50 || $page == 40) { ?> class="current_page_item"<?php } ?>>
			  <a href="">About</a>
			  <ul>
				<li><a href="./?page=2">About NorCast</a></li>
				<li><a href="./?page=3">History</a></li>
				<li><a href="./?page=4">Guest Speakers</a></li>
				<li><a href="./?page=5">Arendal</a></li>
				<li><a href="./?page=50">Gallery</a></li>
			  </ul>
			</li>
			<li<?php if ($page == 40) { ?> class="current_page_item"<?php } ?>><a href="./?page=40">What delegates say</a></li>
			<li<?php if ($page == 51) { ?> class="current_page_item"<?php } ?>><a href="./?page=51">Virtual info</a></li>
			<li<?php if ($page == 7) { ?> class="current_page_item"<?php } ?>><a href="./?page=7">Updates</a></li>
			<li<?php if ($page == 20) { ?> class="current_page_item"<?php } ?>><a href="./?page=20">Program</a></li>
			<li<?php if ($page == 6) { ?> class="current_page_item"<?php } ?>><a href="./?page=6">Sponsors</a></li>
			<li<?php if ($page == 30) { ?> class="current_page_item"<?php } ?>><a href="./?page=30">Committee</a></li>
			<li<?php if ($page == 10) { ?> class="current_page_item"<?php } ?>><a href="./?page=10">Contact</a></li>
		  </ul>
		</nav>

	  </div>
	</div>