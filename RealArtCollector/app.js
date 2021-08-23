const BASE_URL = 'https://api.harvardartmuseums.org';
const KEY = 'apikey=8ccaf097-cc02-428e-9607-0b72489c87d7';

//

async function fetchObjects() {
    const url = `${ BASE_URL }/object?${ KEY }`;

    try{
        const response = await fetch(url);
        const data = await response.json;

        return data;
    }
    catch(error){
        console.error(error);
    }
}

//


async function fetchAllCenturies() {
    const url = `${BASE_URL}/century?${KEY}&size=100&sort=temporalorder`

    if (localStorage.getItem('centuries')) {
        return JSON.parse(localStorage.getItem('centuries'));
      }

    try {
        const response = await fetch(url);
        const data = await response.json();
        const records = data.records;
    
        localStorage.centuries = JSON.stringify(records)
        return records;
      } catch (error) {
        console.error(error);
      }
}

async function fetchAllClassifications() {
    const url = `${BASE_URL}/classification?${KEY}&size=100&sort=name`

    if (localStorage.getItem('classifications')) {
        return JSON.parse(localStorage.getItem('classifications'));
      }

    try {
        const response = await fetch(url);
        const data = await response.json();
        const records = data.records;
    
        localStorage.classifications = JSON.stringify(records)
        return records;
      } catch (error) {
        console.error(error);
      }

}


//


async function prefetchCategoryLists() {
    try {
      const [
        classifications, centuries
      ] = await Promise.all([
        fetchAllClassifications(),
        fetchAllCenturies()
      ]);

      $('.classification-count').text(`(${ classifications.length })`);

      classifications.forEach(classification => {
          let className = classification.name
        let option = $(`<option value=${className}>${className}</option>`)
        $('#select-classification').append(option)
      
      });
      
      $('.century-count').text(`(${ centuries.length }))`);
      
      centuries.forEach(century => {
        let yearName = century.name
        let option = $(`<option value=${yearName}>${yearName}</option>`)
        $('#select-century').append(option)
      });

    } catch (error) {
      console.error(error);
    }

  }

prefetchCategoryLists()

//

async function buildSearchString(){

let select = $('#select-classification').val()
let century = $('#select-century').val()
let keyWord = $('#keywords').val()

let newUrl = `${BASE_URL}/object?${KEY}&classification=${select}&century=${century}&keyword=${keyWord}`

return newUrl
}

//

$('#search').on('submit', async function (event) {
    event.preventDefault()
    onFetchStart();
  
    try {

    const url = await buildSearchString();
    const encodedUrl = encodeURI(url);
    const response = await fetch(encodedUrl);
    const newUrl = await response.json()
    //there's newUrl.info and newUrl.records to use 
    updatePreview(newUrl)

    } catch (error) {
      console.error(error);
    } finally {
        onFetchEnd();
    }

  });

  //

  function onFetchStart() {
    $('#loading').addClass('active');
  }
  
  function onFetchEnd() {
    $('#loading').removeClass('active');
  }

  //

  function renderPreview(record) {
    
    const {description, primaryimageurl, title} = record
    let elImg = ""

    if (primaryimageurl){
        elImg = primaryimageurl
    }

    let preview = $(`<div class="object-preview">
        <a href="#">
        ${description ? `<p>${description}</p>`:""}
        <img src= ${elImg} />
        <h3>${title ? `<p>${title}</p>`:""}</h3>
        </a></div>`
    )

    preview.data('record', record)
    return preview
  
  }
  

  //
  

  function updatePreview(objUrl) {
    const root = $('#preview');
    const results = root.find('.results')
    results.empty()

    const info = objUrl.info
    const records = objUrl.records

    if (info.next){
        $('.next').data('url', info.next)
        $('.next').attr('disabled', false)
    } else {
        $('.next').data('url', null)
        $('.next').attr('disabled', true)
    }

    if (info.prev){
        $('.previous').data('url', info.prev)
        $('.previous').attr('disabled', false)
    } else {
        $('.previous').data('url', null)
        $('.previous').attr('disabled', true)
    }

    records.forEach( (record) => {
        results.append(renderPreview(record))
    })

  }


  //


  $('#preview .next, #preview .previous').on('click', async function () {
    
    onFetchStart()

    try{
    let newUrl = $(this).data('url')
    fetch (newUrl)
    .then((response) => {
        return response.json()
    })
    .then ((data) =>{
        updatePreview(data)
    })
    onFetchEnd()}
    catch (error){
        console.error(error)
    }

  });


  //


  $('#preview').on('click', '.object-preview', function (event) {
    event.preventDefault(); 

    try{
    let newEl = $(this).closest('.object-preview').data('record')
    console.log(newEl)
    $('#feature').html(renderFeature(newEl))
    }
    catch (error){
        console.error(error)
    }
  });


  //


  function renderFeature(record) {

    const {title, dated, images, primaryimageurl, description, culture, style, technique, medium, dimensions, people, department, division, contact, creditline} = record
    let newElement = $(`<div class="object-feature">
    <header>
    <h3>${title}</h3>
    <h4>${dated}</h4>
  </header>

  <section class="facts">
    ${ factHTML("Description", description)}
    ${ factHTML("Culture", culture, 'culture')}
    ${ factHTML("Style", style)}
    ${ factHTML("Technique", technique, 'technique')}
    ${ factHTML("Medium", medium, 'medium')}
    ${ factHTML("Dimensions", dimensions)}
    ${ factHTML("Department", department)}
    ${ factHTML("Division", division)}
    ${ factHTML("Contact", `<a target="_blank" href="mailto:${ contact }">${ contact }</a>`)}
    ${ factHTML("Credit Line", creditline)}
    ${
        people
        ? people.map((person) => {
            return factHTML('Person', person.displayname, 'person');
          }).join('')
        : ''
      }
  </section>

  <section class="photos">
      ${ photosHTML(images, primaryimageurl)}
  </section>

    </div>`);

    return newElement
  }



//


  function searchURL(searchType, searchString) {
    return `${ BASE_URL }/object?${ KEY }&${ searchType}=${ searchString }`;
  }


//


function factHTML (title, content, searchTerm = null){

const factSec = `
    <span class="title">${title}</span>
    <span class="content">${content}</span>`

const searchSec = `
<span class="title">${title}</span>
<a href=${searchURL(searchTerm, content)}>${content}</a>`

if (!content){
    return ""
} else if (searchTerm){
    return searchSec
} else {
    return factSec
}

}


//


function photosHTML(images, primaryimageurl) {

    if (images && images.length>0){
        return images.map((img) => {
            return `<img src=${img.baseimageurl}></img>`
        }).join('')
    } else if (primaryimageurl){
        return `<img src=${primaryimageurl}></img>`
    } else {
        return ""
    }

  }


//


  $('#feature').on('click', 'a', async function (event) {
    const link = $(this).attr("href")
    if (link.startsWith('mailto')) { return; }
    console.log(link)

    event.preventDefault()

    onFetchStart()
    try{
    const encodedUrl = encodeURI(link);
    const response = await fetch(encodedUrl);
    const newUrl = await response.json()
    console.log(newUrl)
    updatePreview(newUrl)
    }
    catch(error){
        console.error(error)
    }
    finally{
        onFetchEnd()
    }
  });