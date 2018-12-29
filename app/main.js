var Application = {};
var Users = {};




/*** Actions  ***/

/**
 * Change users
 */
function setUser(){
  Application.currentUser = document.querySelector('[name=login]:checked').value;
  let preserveStored = true;
  unselectAd(preserveStored);
  let selected = Users[Application.currentUser].selected;
  if (selected){
    document.getElementById(selected).querySelector('button').click();
  }
  setGains(Users[Application.currentUser].gains);
}

/** 
 * Select and activate an Ad
 */
function selectAd(){
  let selectedAd = this.parentElement;
  // Store selected ad
  Users[Application.currentUser].selected = selectedAd.id;
  let clone = selectedAd.cloneNode(true);
  let management = document.querySelector('#section-management main');
  let availableAds = document.querySelector('#available-ads');
  // Set selected as active
  management.parentNode.classList.add('active');
  // Activate manage buttons
  activateActionsButtons(management);
  // Set Active ad
  management.innerHTML = '';
  management.appendChild(clone);
  // Block selection of other ads
  availableAds.classList.add('block-ad');
  availableAds.querySelectorAll('button').forEach(
    function(e){
      e.disabled = true;
      e.removeEventListener('click', selectAd);
    }
  );
}

/**
 * Cash out the reward
 */
function cashOut(addCurrent=true){
  let value = addCurrent ? Number(document.querySelector('#section-management .ad-card span').innerText) : 0 ;
  let gains = Number(Users[Application.currentUser].gains);
  setGains(value+gains);
  storeGains(value+gains);
  unselectAd();
}

function setGains(value){
  document.querySelector('#section-management .gains').innerText = value;
}

function storeGains(value){
  Users[Application.currentUser].gains = value;
}

/** 
 * Un-select any selected ad
 */
function unselectAd(preserveStored){
  // Store selected ad
  if (! preserveStored){
    Users[Application.currentUser].selected = '';
  }
  let management = document.querySelector('#section-management main');
  management.parentNode.classList.remove('active');
  deActivateActionsButtons(management);
  let availableAds = document.querySelector('#available-ads');
  let activeAd = management.querySelector('.ad-card');
  if (activeAd){
    activeAd.parentNode.removeChild(activeAd);
  }
  availableAds.classList.remove('block-ad');
  availableAds.querySelectorAll('button').forEach(
    function(e){
      e.disabled = false;
      activateAdButton(e);
    }
  );
}


/*** Utils ***/
function activateAdButton(el){
  el.addEventListener('click', selectAd);
}

function activateActionsButtons(el, deActivate){
  el.querySelectorAll('.actions button').forEach(
    function(e){
      e.disabled = !deActivate;
    }
  );
}
function deActivateActionsButtons(el){
  activateActionsButtons(el, true);
}
function toggleActivateActionsButtons(el){
  activateActionsButtons(el, el.disabled);
}


/*** Services ***/
function fetch_companies(){
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/tests/data/brands.json');
  xhr.onreadystatechange = function(){
    if (xhr.readyState == xhr.DONE){
      if (xhr.status == 200){
        fill_template('#section-brands form fieldset', JSON.parse(xhr.responseText), '#brand-button', fill_company);
      }else{
        console.log('<dialog>Error: it was not possible to retrieve brand data.</dialog>');
      }
    }
  };
  xhr.send();
}

function fetch_ads(){
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/tests/data/ads.json');
  xhr.onreadystatechange = function(){
    if (xhr.readyState == xhr.DONE){
      if (xhr.status == 200){
        fill_template('#available-ads main', JSON.parse(xhr.responseText), '#ad-card', fill_ad);
      }else{
        console.log('<dialog>Error: it was not possible to retrieve brand data.</dialog>');
      }
    }
  };
  xhr.send();
}

function fetch_users(){
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/tests/data/users.json');
  xhr.onreadystatechange = function(){
    if (xhr.readyState == xhr.DONE){
      if (xhr.status == 200){
        Users = JSON.parse(xhr.responseText);
        setUser();
      }
    }
  };
  xhr.send();
}

/*** Fill Functions (Controlers) ***/
function fill_ad(el, ad){
  el.setAttribute('id', ad.id);
  el.querySelector('h1').innerHTML = ad.title;
  el.querySelector('img').setAttribute('src', '/content/images/'+ad.image);
  el.querySelector('img').setAttribute('alt', ad.alt);
  el.querySelector('span').innerHTML = ad.value;
  el.querySelector('span:nth-child(2)').innerHTML = ad.period;
  el.querySelector('span:nth-child(3)').innerHTML = ad['duration-measure'];
  activateAdButton(el.querySelector('button'));
}

function fill_company(el, company){
  el.querySelector('img').setAttribute('src', '/content/images/'+company.logo);
  el.querySelector('figcaption').innerHTML = company.name;
}


/*** Template Engine ***/
function fill_template(target_selector, data, template_selector, fill_func){
  let target = document.querySelector(target_selector);
  let template = document.querySelector(template_selector);
  let content ='';
  for (let i=0; i<data.length; i++){
    content += template.innerHTML;
  }
  target.innerHTML  += content;
  for (let i=0; i<data.length; i++){
    fill_func(target.querySelectorAll('.'+template.id)[i], data[i]);
  }
}

/*** Start ***/
function preparePage(){
  document.querySelector('#section-management button.cancel')
    .addEventListener('click', unselectAd);
  document.querySelector('#section-management button.ok')
    .addEventListener('click', cashOut);
  document.querySelectorAll('[name=login]').forEach(
    function(e){
      e.addEventListener('click', setUser);
    });
  fetch_users();
  fetch_ads();
  fetch_companies();
}

preparePage();
