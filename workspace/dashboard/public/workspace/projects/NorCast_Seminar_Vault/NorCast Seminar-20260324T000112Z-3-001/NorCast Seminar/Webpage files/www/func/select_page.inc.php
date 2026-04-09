<?php

$open_page = TRUE;

function getpage($page)
{
	switch ($page)
	{
		case 0:
			$file	= "inc/content/01_main.inc.php";
			break;
		case 1:
			$file = "inc/content/01_main.inc.php";
			break;
		case 2:
			$file = "inc/content/02_about.inc.php";
			break;
		case 3:
			$file = "inc/content/03_history.inc.php";
			break;
		case 4:
			$file = "inc/content/04_speakers.inc.php";
			break;
		case 5:
			$file = "inc/content/05_arendal.inc.php";
			break;
		case 6:
			$file = "inc/content/06_sponsors.inc.php";
			break;
		case 7:
			$file = "inc/content/07_updates.inc.php";
			break;
		case 10:
			$file = "inc/content/10_contact.inc.php";
			break;
		case 20:
			$file = "inc/content/20_program.inc.php";
			break;
		case 30:
			$file = "inc/content/30_committee.inc.php";
			break;
		case 40:
			$file = "inc/content/40_delegates_say.inc.php";
			break;
		case 50:
			$file	= "inc/content/50_gallery.inc.php";
			break;		
		case 51:
			$file	= "inc/content/51_Info.inc.php";
			break;
		default:
			$file = "inc/content/01_main.inc.php";
	}
	return (require_once($file));
}

?>