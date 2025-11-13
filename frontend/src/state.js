const loadSet = (key) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

const saveSet = (key, set) => {
  localStorage.setItem(key, JSON.stringify([...set]))
}

export const state = {
  search: '',
  glasses: new Set(),
  categories: new Set(),
  alcoholic: null,
  have: loadSet('have'),
  favorites: loadSet('favorites'),
  ingCat: 'all',
  ingMgrCat: 'all',
  pages: {
    recommend: 1,
    cocktails: 1
  }
}

export const storage = {
  setInventory(items){
    state.have = new Set(items)
    saveSet('have', state.have)
    return [...state.have]
  },
  toggleInventory(name, force){
    const shouldAdd = force ?? !state.have.has(name)
    if (shouldAdd) state.have.add(name); else state.have.delete(name)
    saveSet('have', state.have)
    return [...state.have]
  },
  clearInventory(){
    state.have.clear()
    saveSet('have', state.have)
    return []
  },
  setFavorites(items){
    state.favorites = new Set(items)
    saveSet('favorites', state.favorites)
    return [...state.favorites]
  },
  toggleFavorite(id){
    if (state.favorites.has(id)) state.favorites.delete(id); else state.favorites.add(id)
    saveSet('favorites', state.favorites)
    return [...state.favorites]
  }
}
