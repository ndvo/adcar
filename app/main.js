

// Actions 

/** 
 * Select and activate an Ad
 */
function selectAd(){
  let clone = this.parentElement.cloneNode(true);
  let management = document.querySelector('#section-management main');
  let availableAds = document.querySelector('#available-ads');
  management.innerHTML = '';
  management.appendChild(clone);
  availableAds.classList.add('block-ad');
  Array.from(availableAds.querySelectorAll('button')).forEach(
    function(e){
      e.disabled = true;
      e.removeEventListener('click', selectAd);
    }
  );
}

/** 
 * Un-select any selected ad
 */
function unselectAd(){
  let management = document.querySelector('#section-management main');
  let availableAds = document.querySelector('#available-ads');
  let activeAd = management.querySelector('ad-card');
  activeAd.parentNode.removeChild(activeAd);
  availableAds.classList.remove('block-ad');
  Array.from(availableAds.querySelectorAll('button')).forEach(
    function(e){
      e.disabled = false;
      activateAdButton(e);
    }
  );
}

function activateAdButton(el){
  el.addEventListener('click', selectAd);
}

// Services 
function fetch_companies(){
  let xhr = new XMLHttpRequest();
  xhr.open('GET', '/tests/data/brands.json');
  xhr.onreadystatechange = function(){
    if (xhr.readyState == xhr.DONE){
      if (xhr.status == 200){
        fill_template('#available-ads form fieldset', JSON.parse(xhr.responseText), '#brand-button', fill_company);
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


// Fill Functions
function fill_ad(el, ad){
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


// Fill template engine
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


fetch_ads();
fetch_companies();
