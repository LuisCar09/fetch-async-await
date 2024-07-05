const API = `https://pokeapi.co/api/v2/pokemon`
const appContainer = document.getElementById('app')
const nextBtn = document.getElementById('nextBtn')
const previousBtn = document.getElementById('prevBtn')
const resetBtn = document.getElementById('resetBtn')
const searchBtn = document.getElementById('searchBtn')
const searchInput = document.getElementById('searchInput')

let nextPage = ''
let previousPage = ''
const fetchPokemon = async (URL = 'https://pokeapi.co/api/v2/pokemon/?offset=00&limit=10') => {
    
    try {
        const getPokemons = await fetch(URL)
        const responsePokemons = await getPokemons.json()
        const { next, previous, results } = responsePokemons
        nextPage = next;
        previousPage = previous
        const pokemonsPromises = results.map(async (poke) => await fetch(poke.url).then((data) => data.json()))
        const pokemon = await Promise.all(pokemonsPromises)

        template(pokemon)
    } catch (error) {
        console.log('hemos tenido un error', error);
    }
}

const template = (pokemon) => {
    
    console.log(pokemon);
    let element = ''
    // const fistLetter = name.split('')[0].toUpperCase()
    // const restOfLetter = name.slice(1)
    // const fullName = fistLetter + restOfLetter
    pokemon.forEach((poke,index) => {
        const { name } = poke
        const { sprites } = poke
        element = `
                <article  class='card '>
                    <img src="${sprites.other.dream_world.front_default}" alt="${name}">
                    <h2>${name}</h2>
                    <div id=${name} class="overLay"></div>
                </article>`
                appContainer.insertAdjacentHTML('beforeend',element) 

    
        const imgClick = document.querySelectorAll('.overLay')[index]
        imgClick.addEventListener('click',(e) =>{
           const pokemonName = e.target.id
            
           const getLocalStorage = localStorage.getItem('pokemons')
            
           let arrayPokemons =  getLocalStorage ? JSON.parse(getLocalStorage) : []
            !arrayPokemons.includes(pokemonName) ? arrayPokemons.push(pokemonName) : null
           
           
            localStorage.setItem('pokemons',JSON.stringify(arrayPokemons))

            checkList()
            
        })
        
    })
    checkList()

    
    
   
    
}
const nextPageFunction= ()=>{
    if (nextPage) {
        appContainer.innerHTML = ''
        fetchPokemon(nextPage)
    }
}
const previousPageFunction = () => {
    
    if (previousPage) {
        appContainer.innerHTML = ''
        fetchPokemon(previousPage)
    }
}

const getInputValue = async () => {
    console.log(searchInput.value);
    try {
        const name = searchInput.value.trim().toLowerCase()
        const fetchPokemon = await fetch(`${API}/${name}`)
        const response = await fetchPokemon.json()
        appContainer.innerHTML = ''
        template(response)
    } catch (error) {
        console.error('Error fetching  at getInputValue ', error);
    } finally {
        let element = `<article class='card'>
                        <img src="https://cdn.vectorstock.com/i/2000v/87/74/website-error-404-page-not-found-artwork-depicts-vector-23988774.avif" alt="not-found-image">
                     </article>`
        appContainer.innerHTML = element
    }
}
nextBtn.addEventListener('click', nextPageFunction)
previousBtn.addEventListener('click', previousPageFunction)
searchBtn.addEventListener('click', getInputValue)

resetBtn.addEventListener('click', ()=>{
    location.reload()
})

const checkList = () => {
    const local = localStorage.getItem('pokemons')
    const pokemons = JSON.parse(local)

    pokemons.forEach((poke) => {
        const overLay = document.getElementById(poke)
        overLay.classList.add('border')
        
    })
    
}

fetchPokemon()