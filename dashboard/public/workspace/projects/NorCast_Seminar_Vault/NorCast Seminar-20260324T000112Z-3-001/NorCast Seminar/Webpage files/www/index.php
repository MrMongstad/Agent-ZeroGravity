<?php

header("Content-Type: text/html; charset=utf-8");

/***********************************************************************
 * NorCast Conference
 * ------------------------------
 * Original Date : 04.17.2020
 * Created by    : ModernIT
 ***********************************************************************/

/***********************************************************************
 * Set initial variables
 ***********************************************************************/

global $rootdir;
$rootdir = "./";

$page = $_GET['page'];
if (!$page)
	$page = 1;

//ini_set("display_errors","2");
//ERROR_REPORTING(E_ALL);

/***********************************************************************
 * Include Core Functions
 ***********************************************************************/

require($rootdir . 'func/render_pageui.inc.php');
require($rootdir . 'func/select_page.inc.php');

/***********************************************************************
 * Run Application
 ***********************************************************************/

render_html_header();
render_ui_top();

getpage($page);

render_ui_footer();
render_html_footer();

?>