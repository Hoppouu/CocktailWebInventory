import { el } from './common.js'
import { state } from '../state.js'

export function renderPaginatedList({
  container,
  items = [],
  pageKey,
  pageSize = 12,
  renderItem,
  emptyMessage = '표시할 항목이 없습니다.',
  resetPage = false
}){
  if (!container) return
  if (!state.pages) state.pages = {}
  if (resetPage || !state.pages[pageKey]) state.pages[pageKey] = 1

  const renderPage = (pageOverride) => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
    const current = clamp(pageOverride ?? state.pages[pageKey], 1, totalPages)
    state.pages[pageKey] = current
    container.innerHTML = ''
    if (!items.length){
      container.appendChild(el('div',{class:'empty card'}, emptyMessage))
      return
    }
    const slice = items.slice((current - 1) * pageSize, current * pageSize)
    const frag = document.createDocumentFragment()
    slice.forEach(item => {
      const node = renderItem(item)
      if (node) frag.appendChild(node)
    })
    container.appendChild(frag)
    if (totalPages > 1){
      container.appendChild(buildPager(current, totalPages, (next)=> renderPage(next)))
    }
  }

  renderPage(resetPage ? 1 : state.pages[pageKey])
}

function buildPager(current, total, onChange){
  const nav = el('div',{class:'pager'})
  for (let page = 1; page <= total; page += 1){
    nav.appendChild(
      el('button',{
        type:'button',
        class:`pager__btn ${page===current?'active':''}`,
        onclick:()=> onChange(page)
      }, `페이지 ${page}`)
    )
  }
  return nav
}

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
