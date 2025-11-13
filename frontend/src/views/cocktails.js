import { Api } from '../services/api.js'
import { el } from '../components/common.js'
import { ResultCard } from '../components/resultCard.js'
import { renderPaginatedList } from '../components/pagination.js'
import { state, storage } from '../state.js'

let bound=false
export function bindCocktailsOnce(){
  if (bound) return; bound=true
  const input = document.getElementById('listSearch')
  input.addEventListener('input', async e=>{
    const q = e.target.value.toLowerCase()
    const res = await Api.cocktails({ q })
    renderCards(document.getElementById('cocktailList'), res.items, true)
  })
}

export function renderCards(container, list, resetPage = false){
  if (!container) return
  renderPaginatedList({
    container,
    items: list,
    pageKey: 'cocktails',
    pageSize: 12,
    emptyMessage: '표시할 항목이 없습니다.',
    resetPage,
    renderItem: (cocktail)=>{
      return ResultCard({
        cocktail,
        isFavorite: state.favorites.has(cocktail.id),
        onFavorite: ()=>{
          storage.toggleFavorite(cocktail.id)
          renderCards(container, list)
        }
      })
    }
  })
}

