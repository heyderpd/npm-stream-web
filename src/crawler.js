import { getDomain, getContext, getProp } from './cr-utils'

let domain = ''
const pages = {}

const tryPages = async url => {
  if (!pages[url] && domain === getDomain(url)) {
    pages[url] = true
    try {
      const { title, video, links } = await getContext(url)
      if (video) {
        const name = getProp(title, 'inner-html')
        const src = getProp(video, 'src')
        console.log(name)
        pages[url] = {
          name,
          src
        }
      }
      if (links.length) {
        links
          .map(a => setTimeout(tryPages(getProp(a, 'href')), 500))
      }
    } catch (err) {
      // console.log('err', err)
    }
  }
}
