

function fetch_companies(){
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "/tests/data/brands.json");
  xhr.onreadystatechange = function(){
    if (xhr.readyState == xhr.DONE){
      if (xhr.status == 200){
        let available_form = document.querySelector('#available-ads form');
        let button_tpl = document.querySelector('#brand-button'); 
        let brands = JSON.parse(xhr.responseText);
        let buttons ='';
        for (let i=0; i<brands.length; i++){
          buttons += button_tpl.innerHTML;
        }
        available_form.innerHTML  = buttons;
        for (let i=0; i<brands.length; i++){
          fill_company(available_form.children[i], brands[i]);
        }
      }else{
        available_form.innerHTML = '<dialog>Error: it was not possible to retrieve brand data.</dialog>';
      }
    } 
  };
  xhr.send();
}


function fill_company(el, company){
  el.querySelector('img').setAttribute('src', company.logo);
  el.querySelector('figcaption').innerHTML = company.name;
}

fetch_companies();
