import sampleCode from '../data/sample_code'

export default defineEventHandler((event) => {
  return {
    file: 'https://drive.google.com/uc?export=download&id=1T-gHLYl6K0h59-bYElTrHx2m_ZUz8qEL',
    code: sampleCode.toString()
  }
})