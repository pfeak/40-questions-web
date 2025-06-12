import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()
import { loadQuestions } from '../app/utils/loadQuestions'

describe('数据访问测试', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  test('成功加载year问题', async () => {
    fetchMock.mockResponseOnce(`1. What new things did you try this year?
2. Did you keep your resolutions?`)
    const questions = await loadQuestions('year')
    expect(questions).toEqual([
      "What new things did you try this year?",
      "Did you keep your resolutions?"
    ])
    expect(fetchMock).toHaveBeenCalledWith('data/questions/year.md', {
      headers: { 'Accept': 'text/markdown' }
    })
  })

  test('处理无效类型', async () => {
    fetchMock.mockResponseOnce('', { status: 404 })
    await expect(loadQuestions('invalid')).rejects.toThrow('加载问题失败')
  })
})
