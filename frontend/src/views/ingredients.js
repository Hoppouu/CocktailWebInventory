import { Api } from '../services/api.js'
import { el } from '../components/common.js'
import { state, storage } from '../state.js'
import { updateCounts, renderSelectedSummary, renderIngredients as renderIngredientsInRecommend } from './recommend.js'

export async function renderIngCategoryChips(rootId, isManager=false, taxonomy=null){
  const tax = taxonomy || await Api.taxonomy()
  const root = document.getElementById(rootId)
  if (!root) return
  root.innerHTML = ''
  ;(tax.ingredientCategories||[]).forEach(cat=>{
    const active = (isManager? state.ingMgrCat : state.ingCat) === cat.id
    root.appendChild(el('span', { class:`chip ${active?'active':''}`, onclick:(e)=>{
      if (isManager){
        state.ingMgrCat = cat.id
        renderIngredientsManager(document.getElementById('ingSearch')?.value||'')
      } else {
        state.ingCat = cat.id
        renderIngredientsInRecommend()
      }
      root.querySelectorAll('.chip').forEach(ch=>ch.classList.remove('active'))
      e.currentTarget.classList.add('active')
    }}, cat.label))
  })
}

export async function renderIngredientGroups(rootId, items){
  const root = document.getElementById(rootId)
  if (!root) return
  root.innerHTML = ''
  if (!items.length){
    root.appendChild(el('div',{class:'empty card'},'표시할 재료가 없습니다.'))
    return
  }
  const grid = el('div',{class:'ingredients'})
  items.forEach(name=>{
    const checked = state.have.has(name)
    const label = el('label',{class:`ingredient ${checked?'active':''}`},
      el('input',{type:'checkbox',checked:checked?true:undefined, onchange:e=>{
        storage.toggleInventory(name, e.target.checked)
        label.classList.toggle('active', e.target.checked); updateCounts(); renderSelectedSummary()
      }}),
      el('span',{class:'box'}),
      el('span',{class:'text'}, name)
    )
    grid.appendChild(label)
  })
  root.appendChild(grid)
}

export async function renderIngredientsManager(filterText=''){
  const items = (await Api.ingredients({ category: state.ingMgrCat })).items.filter(n =>
    n.toLowerCase().includes((filterText||'').toLowerCase())
  )
  await renderIngredientGroups('ingredientsManager', items)
}

let bound=false
export function bindIngredientsOnce(){
  if (bound) return; bound = true
  const f = document.getElementById('ingSearch')
  f.addEventListener('input', e=> renderIngredientsManager(e.target.value))
  document.getElementById('ingSelectAll').addEventListener('click', async ()=>{
    const items = (await Api.ingredients()).items
    storage.setInventory(items)
    renderIngredientsManager(f.value||''); updateCounts()
  })
  document.getElementById('ingClearAll').addEventListener('click', ()=>{ storage.clearInventory(); renderIngredientsManager(f.value||''); updateCounts() })
}
