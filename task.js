//*****************************************
//----------variable declaration-----------
//*****************************************

//get references to btns
const yes_consent_btn = document.getElementById('yes-consent-btn');
const no_consent_btn = document.getElementById('no-consent-btn');
const inst_next_btn = document.getElementById('inst-next-btn');
const inst_back_btn = document.getElementById('inst-back-btn');
const save_resp_btn = document.getElementById('save-resp-btn');
const finish_btn = document.getElementById('finish-btn');

//get references to sliders
const age_slider = document.getElementById('age-slider');

//get reference to radio buttons -- currently unused
const gender_radios = document.getElementsByName('rad-gender-answer');

//get references to slider output span elements
const age_output = document.getElementById('age-output');

//get references to pages
const uw_header = document.getElementById('uw-header');
const uw_logo = document.getElementById('uw-logo');
const info_consent_letter = document.getElementById('info-consent-letter');
const demographic_questionnaire = document.getElementById('demographic-questionnaire');
const task_inst = document.getElementById('task-inst');
const decline_to_participate = document.getElementById('decline-to-participate');
const practice_over = document.getElementById('practice-over');
const intermission = document.getElementById('intermission');
const feedback_letter = document.getElementById('feedback-letter');
const do_not_refresh = document.getElementById('do-not-refresh');
const browser_not_supported = document.getElementById('browser-not-supported');

//get references to stim
const stim = document.getElementById('stim-container');

//set participant values
const studyid = 'study-id-here';
const ss_code = getRandomString(8, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const condition = getRandomInt(1,5);

var gender = 'NA';
var age = 'NA';

//experimental constants
const myLetters = ("B,F,K,H,M,Q,R,X,Z").split(","); //9
const trials_per_block = myLetters.length*26; //*26
const num_practice = 18; //18

const prestim_duration = 0;
const stim_duration = 500;
const poststim_duration = 2000;
const trial_duration = prestim_duration + stim_duration + poststim_duration;
//a trial will be defined as  stimulus -> fixation'

//experimental counters
var block_trial = 0; // within a block
var global_trial = 0; // global trial
var this_block = 0;

//experimental toggles
var intermis_avail = true;
var is_practice = true;
var getting_ready = true;
var stim_on = false;
var prestim_on = false;
var poststim_on = false;

//default data values
var key_pressed = false;
var resp_at = 'NA';
var rt = 'None';
var omission = 1;
var is_target = 'NA';
var hit = 'NA';
var fa = 'NA';
var is_focus = false;

//default other values
var stim_time = 'NA';
var prestim_time = 'NA';
var poststim_time = 'NA';
var the_stimulus = 'NA';
var is_target = 'NA';

//containers
var timeout_list = [];
var the_stim_list;
var the_targ_list;

var trial_headers = [
  'ss_code',
  'gender',
  'age',
  'condition',
  'this_block',
  'block_trial',
  'global_trial',
  'the_stimulus',
  'is_target',
  'omission',
  'prestim_at',
  'stim_at',
  'poststim_at',
  'resp_at',
  'rt',
  'hit',
  'fa',
  'is_focus'
];

//data holders
var trial_data = '';

//write headers first
for (var i in trial_headers){
  trial_data+=trial_headers[i];
  if (i < trial_headers.length-1){trial_data+=',';}
  else{trial_data+='\n';}
}

//setup modular task instructions
var inst_p1 =
  "<h2>Task Instructions</h2>"
  +"<p>put instructions here</p>"
  +"<p>Please click the 'Next' button to proceed to the next page of the instructions.</p>";

var inst_p2 =
  "<h2>Task Instructions</h2>"
  +"<p>more instructions here</p><br>";

var inst_p3 =
  "<h2>Task Instructions</h2>"
  +"<p>and more here.</p>";

var inst_pg_list = new Array(inst_p1,inst_p2,inst_p3)
var this_inst_pg = 0; //default start demo
var max_inst_pg = inst_pg_list.length;


practice_over.innerHTML =
  "<p>The practice trials are now over.</p>"
  +"<p>When you are ready to begin the experiment, please click the 'Begin Task' button below</p>";

intermission.innerHTML =
  "<p>The first portion of the experiment is now over.</p>"
  +"<p>For the last portion of the experiment, we would like you to complete the same task as before.</p>"
  +"<p>When you are ready to resume the experiment, please click the 'Resume Task' button below</p>";


//*****************************************
//-------------define functions------------
//*****************************************

function showPage(doc_ele){
	doc_ele.style.visibility ='visible';
	doc_ele.style.display='inline';
}

function hidePage(doc_ele){
	doc_ele.style.visibility ='hidden';
	doc_ele.style.display='none';
}

function getRandomString(length, chars){
	var result = '';
	for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
	return result;
}

function getRandomInt(min, max){
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function isInArray(value, array){return array.indexOf(value) > -1;}

function shuffle(array){
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex){

	// Pick a remaining element...
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex -= 1;

	// And swap it with the current element.
	temporaryValue = array[currentIndex];
	array[currentIndex] = array[randomIndex];
	array[randomIndex] = temporaryValue;
  }
  return array;
}

function generateTrials(num_iterations){
  // how many back
  var nback = 1;

	// create empty lists of desired length
	var temp_stim_list = new Array(num_iterations).fill("");
	var temp_targ_list = new Array(num_iterations).fill(0);
	var i=0;
	var j=0;

  // generate stim list without accidental targets (n-1)
	while(i<num_iterations){
		var itemIndex = getRandomInt(0,myLetters.length);
		var the_stim = myLetters[itemIndex];
		j++;
		if (i==0){
			temp_stim_list[i] = the_stim;
			i++;
		}
		else if((i == 1 && the_stim!=temp_stim_list[i-nback]) || (i > 1 && the_stim!=temp_stim_list[i-nback] && the_stim!=temp_stim_list[i-nback*2])){
			temp_stim_list[i] = the_stim;
			i++;
		}
	}

	// generate target locations
	var targetFrequency = 0.11;
	var num_targets = Math.round(num_iterations*targetFrequency);
	i=0;
	j=0;
	var targetsAdded=0;
	var usedIndexList = [];
	while(i<num_targets){
		var targIndex = getRandomInt(1,num_iterations);
		j++;
		if (isInArray(targIndex,usedIndexList) == false){
			temp_targ_list[targIndex] = 1;
			usedIndexList.push(targIndex);
			i++;
			targetsAdded++;
		}
	}

	// insert targets
	for(var i=0;i<num_iterations;i++){
		if(temp_targ_list[i] == 1 && temp_targ_list[i-nback] != 1){
			temp_stim_list[i] = temp_stim_list[i-nback]; // replace current with n back
		}
		else if(temp_targ_list[i] == 1 && temp_targ_list[i-nback] == 1){
			temp_stim_list[i] = temp_stim_list[i-nback*2]; // replace current with n back
			temp_stim_list[i-nback] = temp_stim_list[i-nback*2];
		}
	}
	return [temp_stim_list, temp_targ_list];
}

// a function to stop all tracked timeouts
function stopTrackedTimeouts(){
  for (var i = 0; i < timeout_list.length; i++){
    clearTimeout(timeout_list[i]);
  }
  timeout_list = [];
}

// a function to stop all timeouts
function stopAllTimeouts(){
  var id = window.setTimeout(null,0);
  while (id--){
    window.clearTimeout(id)
  }
}

// a function to hide all display elements (here, divs and btns)
function hideAllDivs(){
  var divs = document.getElementsByTagName('div');
  var btns = document.getElementsByTagName('button');
  for (var i = 0; i < divs.length; i++){
    hidePage(divs[i]);
  }

  for (var i = 0; i < btns.length;i++){
    hidePage(btns[i]);
  }
  hidePage(uw_header);
}

// set default slider output values
function setSliderValues(){
  age_output.innerHTML = 'Not Selected';
}

//reset default slider values
function resetAllSliders(){
  var inputs = document.getElementsByTagName('input');
  //console.log(sldrs);
  //reset actual value
  for (var i = 0; i < inputs.length; i++){
    if(inputs.type=="range"){inputs[i].value = '';}

    if(inputs[i].classList.contains('clicked')){
      inputs[i].classList.remove('clicked');
      inputs[i].classList.add('not-clicked');
    }
  }
  // reset associated text value
  setSliderValues();
}

// initial get ready message
function getReady(){
  hideAllDivs();
  stim.innerHTML = "<p style='font-size:14pt;'>Get Ready...</p>";
  showPage(stim);
  //stim_time = new Date().getTime();
  getting_ready = true;
  timeout_list.push(setTimeout(drawPostStim,prestim_duration+stim_duration));

}


function drawPrestim(){
  // draw first fixation
  stim.innerHTML = "+";

  // declare on and time
  prestim_on = true;
  prestim_time = new Date().getTime();

  // call draw stim function
  timeout_list.push(setTimeout(drawStim,prestim_duration))
}

function drawStim(){
  // minimum time of previous event met
  //prestim_on = checkMinTime(prestim_on,prestim_time,prestim_duration)

  // set stimulus
  stim.innerHTML = the_stimulus;

  // declare on and time
  stim_time = new Date().getTime();
  stim_on = true;

  // call post-stim function
  timeout_list.push(setTimeout(drawPostStim,stim_duration));
}


// draw fixation for duration
function drawPostStim(){
  // minimum time of previous event met
  stim_on = checkMinTime(stim_on,stim_time,stim_duration);

  // clear stimulus
  stim.innerHTML = "+";

  //declare on and time
  prestim_on = true;
  prestim_time = new Date().getTime();

  // check if following getReady or normal trial
  if(getting_ready){
    getting_ready = false;
    timeout_list.push(setTimeout(runTrial,poststim_duration));
  }
  else{timeout_list.push(setTimeout(nextTrial,poststim_duration));}
}

function nextTrial(){
  // control for variations in trial time on the short-end
  poststim_on = checkMinTime(poststim_on,poststim_time,poststim_duration)

  // run the next trial
  logData();
  block_trial++;
  global_trial++;
  getReady();
  runTrial();

}

window.onkeydown = function(e){
  var key = e.keyCode ? e.keyCode: e.which;
  if(!key_pressed && key == 32 && (probe_avail)){
    resp_at = new Date().getTime();
    //rt = new Date().getTime() - prestim_time;
    omission = 0;
    key_pressed = true;
    //console.log('key pressed');
    if(is_target==1){
      hit = 1;
      //console.log('hit');
    }
    else{
      fa = 1;
      //console.log('fa');
    }
  }
}

// main trial loop
function runTrial(){
  // is it practice and over?
  if (is_practice && block_trial == num_practice){endPractice();}
  // is it not practice and over?
  else if (!is_practice && block_trial == trials_per_block){
    // hide stimulus
    hidePage(stim);
    // if first block, do intermission
    if (intermis_avail){doIntermission();}
    // otherwise experiment is over
    else{
      endLog();
      submitData();
    }
  }
  // otherwise do trial
  else{doTrial();}
}

// actual trial component
function doTrial(){
  // reset relevant values
  key_pressed = false;
  resp_at = 'NA';
  rt = 'NA';
  omission = 1;

  // clear tracked timeouts, and check for/clear rogue timeouts
  stopTrackedTimeouts();
  stopTrackedTimeouts();

  // assign stimulus and target identity
  the_stimulus = the_stim_list[block_trial];
  is_target = the_targ_list[block_trial];

  if(is_target==1){
    hit = 0;
    fa = 'NA';
  }
  else{
    hit = 'NA';
    fa = 0;
  }
  //drawPrestim();
  drawStim();
  //console.log(this_block, block_trial, the_stimulus, is_target, is_probe, video_state);
}

function checkMinTime(event_running, event_start_time, min_duration){
  while (event_running){
		if (new Date().getTime() - event_start_time >= min_duration){
      event_running = false;
      //console.log(new Date().getTime() - event_start_time);
    }
	}
  return event_running;
}

// display practice over and update values
function endPractice(){
  is_practice = false;
  updateBlockCounters();
  //console.log('@ PRACTICE OVER');

  hidePage(stim);
  inst_next_btn.innerHTML = 'Begin Task';

  showPage(practice_over);
  showPage(inst_next_btn);

  //should be global
  [the_stim_list,the_targ_list] = generateTrials(trials_per_block);
}

function updateBlockCounters(){
  block_trial = 0;
  this_block++;
}

//do intermission and update values
function doIntermission(){

  showPage(intermission);
  intermis_avail = false;
  inst_next_btn.innerHTML = 'Resume Task';
  showPage(inst_next_btn);

  //should be global scope
  [the_stim_list,the_targ_list] = generateTrials(trials_per_block);

  updateBlockCounters();
}

function logData(){
  //if a response was made
  if(omission==0){
    //resp at should occur after stim_time, otherwise early/negative response
    rt = resp_at-stim_time;
  }
  var output = [
    ss_code,
    gender,
    age,
    condition,
    this_block,
    block_trial,
    global_trial,
    the_stimulus,
    is_target,
    omission,
    prestim_time,
    stim_time,
    poststim_time,
    resp_at,
    rt,
    hit,
    fa,
    document.hasFocus()
  ];

  for (var i in output){
    trial_data+=output[i];
    if(i<output.length-1){trial_data+=',';}
    else{trial_data+='\n';}
  }
}

function submitData(){
  document.getElementById('put-studyid-here').value = studyid;
  document.getElementById('put-sscode-here').value = ss_code;
  document.getElementById('put-data-here').value = trial_data;
  document.getElementById('sendtoPHP').submit();
}

//consent to participate
yes_consent_btn.addEventListener('click',function(event){
  hidePage(info_consent_letter);
  hidePage(yes_consent_btn);
  hidePage(no_consent_btn);

  showPage(demographic_questionnaire);
  showPage(inst_next_btn);
  showPage(inst_back_btn);
  window.scrollTo(0,0);
});

//decline to participate
no_consent_btn.addEventListener('click',function(event){
  hidePage(info_consent_letter);
  hidePage(yes_consent_btn);
  hidePage(no_consent_btn);
  showPage(decline_to_participate);
});

inst_next_btn.addEventListener('click',function(event){
  // if demographic page, save demographic data
  if(this_inst_pg==0){
    // save gender
    gender = $("input:radio[name=rad-gender-answer]:checked").val();

    // save age if slider clicked
    if (age_slider.classList.contains('clicked')){age = age_slider.value;}

    // hide and show next page
    hidePage(demographic_questionnaire);
    showPage(task_inst);
    task_inst.innerHTML = inst_p1;
  }

  // increment counter
  if(this_inst_pg<4){this_inst_pg+=1;}

  // about to start practice
  if(this_inst_pg==3){
    //hidePage(thought_probe);
    inst_next_btn.innerHTML = 'Begin Practice Trials';
  }

  // show probe example
  if(this_inst_pg==2){
    //showPage(thought_probe);
    resetAllSliders();
  }

  // load instructions or start task
  if(this_inst_pg<=3){
    task_inst.innerHTML = inst_pg_list[this_inst_pg-1];
    window.scrollTo(0,0);
  }
  else{
    getReady();
    resetAllSliders();
  }
});

inst_back_btn.addEventListener('click',function(event){
  if(this_inst_pg==3){inst_next_btn.innerHTML = 'Next';}
  if(this_inst_pg>-1){this_inst_pg-=1;}
  if(this_inst_pg==0){
    hidePage(task_inst);
    showPage(demographic_questionnaire);
  }
  if(this_inst_pg==-1){
    hidePage(demographic_questionnaire);
    hidePage(inst_next_btn);
    hidePage(inst_back_btn);

    showPage(info_consent_letter);
    showPage(yes_consent_btn);
    showPage(no_consent_btn);
  }
  else{
    task_inst.innerHTML = inst_pg_list[this_inst_pg-1];
    window.scrollTo(0,0);
  }
  if(this_inst_pg==2){
    //showPage(thought_probe);
    resetAllSliders();
  }
  else{
    //hidePage(thought_probe);
    resetAllSliders();
  }
});


finish_btn.addEventListener('click',function(){
  seen_video = $("input:radio[name=rad-video-answer]:checked").val();
  endLog();
  submitData();
});

age_slider.addEventListener('click',function(){
  if (age_slider.classList.contains('not-clicked')){
    age_slider.classList.remove('not-clicked');
    age_slider.classList.add('clicked');
  }
});

// prevent mousewheel scrolling
$(document).on("wheel", "input[type=range]", function (e) {
    $(this).blur();
});

//update slider output values oninput
//--need to update to include onchange for IE
age_slider.oninput = function(){age_output.innerHTML = this.value;}



//*****************************************
//-----------starting experiment-----------
//*****************************************


//DETECT Browsers
function getBrowser(){
  // Opera 8.0+
  var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

  // Firefox 1.0+
  var isFirefox = typeof InstallTrigger !== 'undefined';

  // Safari 3.0+ "[object HTMLElementConstructor]"
  var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

  // Internet Explorer 6-11
  var isIE = /*@cc_on!@*/false || !!document.documentMode;

  // Edge 20+
  var isEdge = !isIE && !!window.StyleMedia;

  // Chrome 1 - 71
  var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

  // Blink engine detection
  var isBlink = (isChrome || isOpera) && !!window.CSS;

  var output = 'Detecting browsers by ducktyping:<hr>';
  output += 'isFirefox: ' + isFirefox + '<br>';
  output += 'isChrome: ' + isChrome + '<br>';
  output += 'isSafari: ' + isSafari + '<br>';
  output += 'isOpera: ' + isOpera + '<br>';
  output += 'isIE: ' + isIE + '<br>';
  output += 'isEdge: ' + isEdge + '<br>';
  output += 'isBlink: ' + isBlink + '<br>';
  //document.body.innerHTML = output;

  if(isFirefox || isChrome || isOpera){
    showPage(info_consent_letter);
    showPage(yes_consent_btn);
    showPage(no_consent_btn);
    showPage(do_not_refresh);

    [the_stim_list, the_targ_list] = generateTrials(num_practice);

    //set initial default slider values
    setSliderValues();
  }
  else{
    browser_not_supported.innerHTML =
      "<p>Unfortunately the browser you are using is not supported for this experiment.</p>"
      +"<p>Please copy the address and reload the webpage using one of the following browsers:</p>"
      +"<p><b><a href='https://www.mozilla.org/en-US/firefox/new/' target='_blank'>Firefox</a>"
      +"| <a href='https://www.google.com/chrome/' target='_blank'>Google Chrome</a>"
      +"| <a href='https://www.opera.com/' target='_blank'>Opera</a></b></p>";
    showPage(browser_not_supported);
  }
}

getBrowser();
