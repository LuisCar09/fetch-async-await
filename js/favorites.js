console.log(localStorage.getItem('pokemons'))
const appContainer = document.getElementById('appFavorites')

const API = `https://pokeapi.co/api/v2/pokemon`

const fetchPokemon = async () => {
    const pokemons = JSON.parse(localStorage.getItem('pokemons'))
   
    const getPokemons = pokemons.map( async (poke) => {

        const pokemonResponse = await fetch(`${API}/${poke}`)
        const response = await pokemonResponse.json()
        return response
    })
    
    const allPromisesSettled = await Promise.all(getPokemons)
    template(allPromisesSettled)
}

const template = async(pokemon) => {

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

    })
     
    
}


fetchPokemon()