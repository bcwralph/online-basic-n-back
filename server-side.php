<?php

  // get study folders
  $dirs = array_map(function($elem){return str_replace('../../study_output/', '', $elem);}, glob('../../study_output/*', GLOB_ONLYDIR));

  // get data pushed
  $studyid=$_POST['put-studyid-here'];
  $sscode=$_POST['put-sscode-here'];
  $data=$_POST['put-data-here'];

  // check if study is listed in dirs
  if (!in_array($studyid,$dirs)){die('invalid study');}

  // check if student id is listed
  if (!isset($sscode)){die('no sscode specified');}

  // check if data packet exists
  if (!isset($data)){die('no data specified');}

  // write to file
  file_put_contents('../../study_output/' . $studyid . '/' . $studyid . '-' . $sscode . '-data.txt', $data, FILE_APPEND);

  // include feedback letter
  include("feedback-letter.html");
?>
