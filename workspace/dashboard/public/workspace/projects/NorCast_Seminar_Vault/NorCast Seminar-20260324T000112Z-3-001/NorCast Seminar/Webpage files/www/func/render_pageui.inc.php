<?php

function render_html_header()
{
	require_once ('./inc/html/html_header.inc.php');
	echo "\n";
}

function render_ui_top()
{
	require_once ('./inc/html/ui_header.inc.php');
	echo "\n";
}

function render_ui_footer()
{
  require_once ('./inc/html/ui_footer.inc.php');
  echo "\n";
}

function render_html_footer()
{
  require_once ('./inc/html/html_footer.inc.php');
  echo "\n";
}

?>