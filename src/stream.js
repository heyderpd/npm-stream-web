import { mkdir, getPathToFile, stream, cannotBeUndefined } from './st-utils'
import { keys } from 'pytils'

export const tryGetFromStreamList = (streamList, path = './download', prefix = 'vd', format = 'mp4') => {
  const streamPromise = _streamPromise(
    getPathToFile(path, prefix, format))

  const promiseList = keys(streamList)
    .map(
      fileName => streamPromise(fileName, streamList[fileName]))
  
  Promise
    .all(promiseList)
    .then(res => console.log(`End all download's`, res))
}

const _streamPromise = getPathFrom => (fileName, url) => {
  cannotBeUndefined({fileName, url})
  return stream(
    url,
    getPathFrom(fileName))
}
