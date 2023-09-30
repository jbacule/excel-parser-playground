import defaultCode from '../data/default_code'

export default defineEventHandler((event) => {
  return {
    code: defaultCode.toString()
  }
})