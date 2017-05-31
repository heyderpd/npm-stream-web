import rp from 'request-promise'
import { parse } from 'html-parse-regex'

export const getDomain = url => (/https?:\/\/(?:www.)([^\/]+)\//.exec(url) || {})[1]

export const getProp = (node, prop) => {
  return node.tuple
    ? node.child.params[prop]
    : (prop === 'inner-html'
      ? node.inner
      : node.params[prop])
}

const findInChildren = (tag, has) => node => {
  return node.tag === tag && node.params[has]
    ? node
    : node.inner.filter(findInChildren(tag, has)).pop()
}

const filterByTag = nodeList => (tag, has, child) => {
  return child && child !== 'inner-html'
    ? nodeList
        .map(node => {
          if (node.tag === tag) {
            if (has ? node.params[has] : true) {
              return node
            } else {
              const son = node.inner.filter(findInChildren(child, has)).pop()
              if (son) {
                return ({
                  "tuple": true,
                  "father": node,
                  "child": son,
                })
              }
            }
          }
        })
        .filter(t => t)
    : nodeList
      .filter(node =>
        node.tag === tag
        && (has ? node.params[has] : true)
        && (child === 'inner-html' ? typeof(node.inner) === 'string' : true))
}

export async function getContext(url) {
  try {
    const htmlStr = await rp(url)
    const { List } = parse(htmlStr)
    const links = filterByTag(List)('a', 'href')
    const title = filterByTag(List)('h1', false, 'inner-html')
      .concat(filterByTag(List)('title', false, 'inner-html'))
      .pop()
    const video = filterByTag(List)('video', 'src', 'source')
      .pop()
    return ({
      title,
      video,
      links
    })
  } catch (err) {
    // console.log('err', err)
  }
}
