
import got from 'got'
import {
  fetchJSON,
  extractContent,
  fetchMovies
} from './douban-detail'

jest.mock('got', () => jest.fn())

/* eslint-disable-next-line */
const body = '{"rating": {"max": 10, "average": 8.3, "stars": "45", "min": 0}, "reviews_count": 701, "wish_count": 358779, "douban_site": "", "year": "2018", "images": {"small": "http://img7.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2529365085.jpg", "large": "http://img7.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2529365085.jpg", "medium": "http://img7.doubanio.com\/view\/photo\/s_ratio_poster\/public\/p2529365085.jpg"}, "alt": "https:\/\/movie.douban.com\/subject\/26336252\/", "id": "26336252", "mobile_url": "https:\/\/movie.douban.com\/subject\/26336252\/mobile", "title": "\u789f\u4e2d\u8c0d6\uff1a\u5168\u9762\u74e6\u89e3", "do_count": null, "share_url": "http:\/\/m.douban.com\/movie\/subject\/26336252", "seasons_count": null, "schedule_url": "https:\/\/movie.douban.com\/subject\/26336252\/cinema\/", "episodes_count": null, "countries": ["\u7f8e\u56fd"], "genres": ["\u52a8\u4f5c", "\u60ca\u609a", "\u5192\u9669"], "collect_count": 350167, "casts": [{"alt": "https:\/\/movie.douban.com\/celebrity\/1054435\/", "avatars": {"small": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p567.jpg", "large": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p567.jpg", "medium": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p567.jpg"}, "name": "\u6c64\u59c6\u00b7\u514b\u9c81\u65af", "id": "1054435"}, {"alt": "https:\/\/movie.douban.com\/celebrity\/1044713\/", "avatars": {"small": "http://img7.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1371934661.95.jpg", "large": "http://img7.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1371934661.95.jpg", "medium": "http://img7.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1371934661.95.jpg"}, "name": "\u4ea8\u5229\u00b7\u5361\u7ef4\u5c14", "id": "1044713"}, {"alt": "https:\/\/movie.douban.com\/celebrity\/1048129\/", "avatars": {"small": "http://img7.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p8712.jpg", "large": "http://img7.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p8712.jpg", "medium": "http://img7.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p8712.jpg"}, "name": "\u6587\u00b7\u745e\u59c6\u65af", "id": "1048129"}, {"alt": "https:\/\/movie.douban.com\/celebrity\/1035648\/", "avatars": {"small": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p8176.jpg", "large": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p8176.jpg", "medium": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p8176.jpg"}, "name": "\u897f\u8499\u00b7\u4f69\u5409", "id": "1035648"}], "current_season": null, "original_title": "Mission: Impossible - Fallout", "summary": "\u6709\u65f6\u597d\u610f\u4f1a\u9020\u6210\u6076\u679c\uff0c\u4eba\u53cd\u800c\u88ab\u81ea\u5df1\u6240\u9020\u6210\u7684\u7ed3\u679c\u6240\u56f0\u6270\u3002\u4f0a\u6851\u00b7\u4ea8\u7279\uff08\u6c64\u59c6\u00b7\u514b\u9c81\u65af\uff09\u548c\u4ed6\u7684IMF\u56e2\u961f\uff08\u4e9a\u5386\u514b\u00b7\u9c8d\u5fb7\u6e29\u3001\u897f\u8499\u00b7\u4f69\u5409\u3001\u6587\u00b7\u745e\u59c6\u65af\uff09\u5c06\u5728\u6700\u65b0\u7684\u7535\u5f71\u300a\u789f\u4e2d\u8c0d6\uff1a\u5168\u9762\u74e6\u89e3\u300b\u4e2d\u518d\u5ea6\u56de\u5f52\uff0c\u4ed6\u4eec\u4f1a\u4e0e\u89c2\u4f17\u4eec\u719f\u6089\u7684\u76df\u53cb\uff08\u4e3d\u8d1d\u5361\u00b7\u5f17\u683c\u68ee\u3001\u7c73\u6b47\u5c14\u00b7\u83ab\u5a1c\u6c49\uff09\u4e00\u8d77\u4e0e\u65f6\u95f4\u8d5b\u8dd1\uff0c\u5e94\u5bf9\u4e00\u6b21\u4efb\u52a1\u4e2d\u51fa\u73b0\u7684\u610f\u5916\u3002\u4ea8\u5229\u00b7\u5361\u7ef4\u5c14\u3001\u5b89\u5409\u62c9\u00b7\u8d1d\u585e\u7279\u548c\u51e1\u59ae\u838e\u00b7\u67ef\u6bd4\u4e5f\u5c06\u52a0\u5165\u672c\u7247\u7684\u6f14\u5458\u9635\u5bb9\uff0c\u7535\u5f71\u5236\u7247\u4eba\u514b\u91cc\u65af\u6258\u592b\u00b7\u8fc8\u8003\u5229\u5c06\u4f1a\u518d\u5ea6\u62c5\u4efb\u5bfc\u6f14\u3002", "subtype": "movie", "directors": [{"alt": "https:\/\/movie.douban.com\/celebrity\/1276314\/", "avatars": {"small": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1535912054.09.jpg", "large": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1535912054.09.jpg", "medium": "http://img3.doubanio.com\/view\/celebrity\/s_ratio_celebrity\/public\/p1535912054.09.jpg"}, "name": "\u514b\u91cc\u65af\u6258\u5f17\u00b7\u9ea6\u594e\u91cc", "id": "1276314"}], "comments_count": 65884, "ratings_count": 177162, "aka": ["\u789f\u4e2d\u8c0d6", "\u4e0d\u53ef\u80fd\u7684\u4efb\u52a1\uff1a\u5168\u9762\u74e6\u89e3(\u53f0)", "\u804c\u4e1a\u7279\u5de5\u961f\uff1a\u53db\u9006\u4e4b\u8c1c(\u6e2f)", "Mission: Impossible 6", "MI6"]}'

describe('fetchJSON()', () => {
  beforeEach(() => {
    got.mockReset()
    got.mockResolvedValue({statusCode: 200, body: body})
  })
  it('should send a request to douban API server via got', async () => {
    await fetchJSON()
    expect(got).toHaveBeenCalled()
  })

  it('should receive a doubanId and resolve to full uri then give it to got', async () => {
    await fetchJSON('26336252')
    expect(got).toHaveBeenCalledWith('http://api.douban.com/v2/movie/subject/26336252')
  })

  it('should resolves the body out of the response as its value', async () => {
    const body = await fetchJSON('123')
    expect(typeof body).toBe('object')
  })

  it('should resolves the field out of its value', async () => {
    const body = await fetchJSON('123')
    expect(body.aka[3]).toEqual('Mission: Impossible 6')
  })

  it('should rejects if response status code is not 200', done => {
    got.mockResolvedValue({statusCode: 401, body: '{"empty": "data"}'})
    fetchJSON()
      .then(() => {
        done.fail('should not be here')
      }).catch(error => {
        expect(error).toEqual('Status code: 401')
        done()
      })
  })

  it('should rejects when got was reject', done => {
    got.mockRejectedValue(new Error('bad request'))
    fetchJSON()
      .then(() => {
        done.fail('should not be here')
      }).catch(error => {
        expect(error).toEqual('bad request')
        done()
      })
  })
})

describe('extractContent()', () => {
  it('should extract all the field out and return a content object', () => {
    const content = extractContent({})
    expect(typeof content).toBe('object')
  })

  it('should rejects if argument is falsy', () => {
    expect(extractContent).toThrow('bad argument')
  })

  it('should find the fields from the passing in object', () => {
    const content = extractContent({})
    expect(Object.keys(content).length).toBe(8)
  })

  it('should get the field from argument if it is valid', () => {
    const content = extractContent({summary: 'a movie'})
    expect(content.summary).toBe('a movie')
  })

  it('should take a null as its value if the fields of argument is falsy', () => {
    const content = extractContent({})
    expect(content.rate).toBe(null)
  })

  it('should get rate if its valid', () => {
    const content = extractContent({rating: {average: 9}})
    expect(content.rate).toBe(9)
  })

  it('should take an empty array as the default value of genres', () => {
    const content = extractContent({})
    expect(content.genres).toEqual([])
  })

  it('should leave category as undefined', () => {
    const content = extractContent({})
    expect(content.category).toBe(undefined)
  })
})

describe('fetchMovies()', () => {
  beforeEach(() => {
    got.mockReset()
    got.mockResolvedValue({statusCode: 200, body: body})
  })

  it('should reveives a doubanId array and calls fetchJSON for each item', () => {
    fetchMovies(['111', '222', '333', '444', '555'])
    expect(got.mock.calls.length).toBe(5)
  })

  it('should maps extractContent with the result of fetchJSON as each item and returns', async () => {
    const movies = await fetchMovies(['111', '222', '333', '444', '555'])
    expect(movies.data.length).toBe(5)
  })

  it('should has the movies in each item of the result', async () => {
    const movies = await fetchMovies(['111', '222', '333', '444', '555'])
    expect(movies.data[1].rawTitle).toBe('Mission: Impossible - Fallout')
  })

  it('should record the numbers of successed and failed', async () => {
    got.mockResolvedValueOnce({statusCode: 200, body: body})
    got.mockResolvedValueOnce({statusCode: 200, body: {}})
    got.mockResolvedValueOnce({statusCode: 200, body: body})
    got.mockResolvedValueOnce({statusCode: 200 })
    got.mockResolvedValueOnce({statusCode: 200, body: body})
    const movies = await fetchMovies(['111', '222', '333', '444', '555'])
    expect(movies.count).toBe(5)
    expect(movies.successNum).toBe(3)
    expect(movies.failedNum).toBe(2)
  })
})
