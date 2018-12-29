

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

function fill_ad(el, ad){
  console.log(el, ad);
  el.querySelector('h1').innerHTML = ad.title;
  el.querySelector('img').setAttribute('src', ad.image);
  el.querySelector('img').setAttribute('alt', ad.alt);
  el.querySelector('span').innerHTML = ad.value;
  el.querySelector('span:nth-child(2)').innerHTML = ad.period;
  el.querySelector('span:nth-child(3)').innerHTML = ad['duration-measure'];
}

function fill_company(el, company){
  el.querySelector('img').setAttribute('src', company.logo);
  el.querySelector('figcaption').innerHTML = company.name;
}

function fill_template(target_selector, data, template_selector, fill_func){
  let target = document.querySelector(target_selector);
  let template = document.querySelector(template_selector); 
  let content ='';
  for (let i=0; i<data.length; i++){
    content += template.innerHTML;
  }
  target.innerHTML  += content;
  for (let i=0; i<data.length; i++){
    console.log(template.id ,template.querySelectorAll('.'+template.id)[i], data[i]);
    fill_func(target.querySelectorAll('.'+template.id)[i], data[i]);
  }
}


fetch_ads();
fetch_companies();
