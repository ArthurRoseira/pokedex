const loader = document.querySelector('.loader');
const board = document.querySelector('#board');
const pageControl = document.querySelector('.pagination');
const btnSearch = document.querySelector('#search_name');

let listPokemons = [];
let pokemonData = [];
let pageLimit = 16;
let actualPage = 1;

const fetchPokemons = () => {

 // loader.style.visibility = 'visible';
 const promisses = []

 for (let id = 1; id <= 890; id++) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`
  promisses.push(fetch(url).then(response => response.json()));
 }
 Promise.all(promisses).then(pokemons => {
  pokemonData = pokemons;
  pokemons.forEach(pokemon => {
   const types = pokemon.types.map(typeinfo => typeinfo.type.name)
   let card = `
    <div class="col s12 m3 hoverable">
    <div class="card">
     <div class="card-image">
      <img src="https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png">
      <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons">add</i></a>
     </div>
     <div class="card-content">
      <span class="card-title"><strong>#${pokemon.id}</strong> ${pokemon.name}</span>
      <p>${types.join(' | ')}</p>
     </div>
    </div>
   </div>
   `
   listPokemons.push(card)
  })

 }).finally(() => {
  setTimeout(function () { loader.style.visibility = 'hidden'; }, 500);
  pagination(1, listPokemons);
 })
}

function pagination(pageNum, searchList) {
 actualPage = pageNum;
 pageControl.innerHTML = '<li class="waves-effect disabled"  id="down"><a href="#!"><i class="material-icons">chevron_left</i></a></li>'
 let maxPages = Math.round(searchList.length / pageLimit);
 let pages = 0
 maxPages < pageNum + 5 ? pages = maxPages : pages = (pageNum + 5)
 for (let i = pageNum; i <= pages; i++) {
  let pageIcon = `<li class="waves-effect" id='pages' data-id='${i}'><a href="#!">${i}</a></li>`;
  pageControl.innerHTML = pageControl.innerHTML + pageIcon
 }
 pageControl.innerHTML = pageControl.innerHTML + '<li class="waves-effect" id="up"><a href="#!"><i class="material-icons">chevron_right</i></a></li>'
 paginationEvents(searchList);
 pageControl.classList.remove('hide')
 board.innerHTML = ''
 last = pageLimit * pageNum
 let list = searchList.slice(last - 16, last)
 list.forEach(card => {
  board.innerHTML = board.innerHTML + card
 })
}

function paginationEvents(searchList) {
 let maxPages = Math.round(searchList.length / pageLimit);
 const pagesBtn = [...document.querySelectorAll('#pages')]
 const pageupBtn = document.querySelector('#up')
 const pagedownBtn = document.querySelector('#down')
 if (actualPage == 1) {
  pageupBtn.classList.remove('disabled')
  pagedownBtn.classList.add('disabled')
 } else if (actualPage < maxPages) {
  pageupBtn.classList.remove('disabled')
  pagedownBtn.classList.remove('disabled')
 } else if (actualPage == maxPages) {
  pageupBtn.classList.add('disabled')
  pagedownBtn.classList.remove('disabled')
 }
 pagesBtn.forEach(btn => {
  btn.addEventListener('click', () => {
   pagination(parseInt(btn.dataset.id), searchList);
  })
 })
 pageupBtn.addEventListener('click', () => {
  pagination(actualPage + 1, searchList);
 })
 pagedownBtn.addEventListener('click', () => {
  pagination(actualPage - 1, searchList);
 })
}

function searchbyname(name) {
 const pokemons = pokemonData.filter(pokemon => pokemon.name == name);
 console.log(pokemons);
 let resultSearch = []
 for (let i = 0; i < pokemons.length; i++) {
  let id = pokemons[i].id;
  for (let j = 0; j <= listPokemons.length; j++) {
   if (id - 1 == j) {
    resultSearch.push(listPokemons[j])
    console.log(resultSearch);
   }
  }
 }
 pagination(1, resultSearch);
}


document.addEventListener("DOMContentLoaded", () => {
 fetchPokemons();
 btnSearch.addEventListener('click', (event) => {
  event.preventDefault()
  let value = document.querySelector('#search').value
  searchbyname(value);
 })
})