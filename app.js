//nodejs中默认支持CommonJs模块格式，如果想使用es6的格式需要使用babelNode支持
const express = require('express')
const mysql = require('mysql')
const constant = require('./const')
const cors = require('cors')
//app代表我们的web应用
const app = express()
app.use(cors())

app.get('/', (req, res) => {
    res.send(new Date().toDateString())
})

//连接数据库
function connect() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'book' //database为已创建的一个数据库名称
    })
}

//n表示你要几本书，l表示你一共有几本书
function randomArray(n, l) {
    let rnd = []
    for (let i = 0; i < n; i++) {
        rnd.push(Math.floor(Math.random() * l))
    }
    return rnd
}
//随机获取分类id
function createCategoryId(n) {
    const arr = []
    constant.category.forEach((item, index) => {
        arr.push(index + 1)
    })
    const result = []
    for (let i = 0; i < n; i++) {
        //获取的随机数不能重复
        const ran = Math.floor(Math.random() * arr.length - i)
        //获取分类对应的序号
        result.push(arr[ran])
        //将已获取的随机数用最后一位取代
        arr[ran] = arr[arr.length - 1 - i]
    }
    return result
}

function createGuessYouLike(data) {
    const n = parseInt(randomArray(1, 3)) + 1
    data['type'] = n
    switch (n) {
        case 1:
            data['result'] = data.id % 2 === 0 ? '《Executing Magic》' : '《Elements Of Robotics》'
            break
        case 2:
            data['result'] = data.id % 2 === 0 ? '《Improving Psychiatric Care》' : '《Programming Languages》'
            break
        case 3:
            data['result'] = '《Living with Disfigurement》'
            data['percent'] = data.id % 2 === 0 ? '92%' : '97%'
            break
    }
    return data
}

function createRecommendData(data) {
    data['readers'] = Math.floor(data.id / 2 * randomArray(1, 100))
    return data
}

function createCategoryData(data) {
    const categoryIds = createCategoryId(6)
    const result = []
    categoryIds.forEach(categoryId => {
        const subList = data.filter(item => item.category === categoryId).slice(0, 4)
        //对相应分类里的前四本书进行封装，这里的item为item.category
        subList.map(item => handleData(item))
        result.push({
            category: categoryId,
            list: subList
        })
    })
    return result.filter(item => item.list.length === 4)
}
//对取出的数据进行封装
function createData(results, key) {
    return handleData(results[key])
}

function handleData(data) {
    //数据库中存放电子书的封面地址为相对路径，需要修改
    if (!data.cover.startsWith('http://')) {
        data['cover'] = `${constant.resUrl}/img/${data.cover}`
    }
    data['selected'] = false
    data['private'] = false
    data['cache'] = false
    data['haveRead'] = 0
    return data
}
//获取首页数据
app.get('/book/home', (req, res) => {
    const conn = connect()
    conn.query('select * from book where cover != \'\'', (err, result) => {
        const length = result.length
        const guessYouLike = []
        const banner = [constant.resUrl + '/photo1.jpg', constant.resUrl + '/photo2.jpg', constant.resUrl + '/photo3.jpg'] //首页封面轮播图
        const recommend = [] //推荐
        const featured = [] //精选
        const random = [] //随机推荐图书(一本)
        const categoryList = createCategoryData(result)
        const categories = [
            {
              category: 1,
              num: 56,
              img1: constant.resUrl + '/cover/cs/A978-3-319-62533-1_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/cs/A978-3-319-89366-2_CoverFigure.jpg'
            },
            {
              category: 2,
              num: 51,
              img1: constant.resUrl + '/cover/ss/A978-3-319-61291-1_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/ss/A978-3-319-69299-9_CoverFigure.jpg'
            },
            {
              category: 3,
              num: 32,
              img1: constant.resUrl + '/cover/eco/A978-3-319-69772-7_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/eco/A978-3-319-76222-7_CoverFigure.jpg'
            },
            {
              category: 4,
              num: 60,
              img1: constant.resUrl + '/cover/edu/A978-981-13-0194-0_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/edu/978-3-319-72170-5_CoverFigure.jpg'
            },
            {
              category: 5,
              num: 23,
              img1: constant.resUrl + '/cover/eng/A978-3-319-39889-1_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/eng/A978-3-319-00026-8_CoverFigure.jpg'
            },
            {
              category: 6,
              num: 42,
              img1: constant.resUrl + '/cover/env/A978-3-319-12039-3_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/env/A978-4-431-54340-4_CoverFigure.jpg'
            },
            {
              category: 7,
              num: 7,
              img1: constant.resUrl + '/cover/geo/A978-3-319-56091-5_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/geo/978-3-319-75593-9_CoverFigure.jpg'
            },
            {
              category: 8,
              num: 18,
              img1: constant.resUrl + '/cover/his/978-3-319-65244-3_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/his/978-3-319-92964-4_CoverFigure.jpg'
            },
            {
              category: 9,
              num: 13,
              img1: constant.resUrl + '/cover/law/2015_Book_ProtectingTheRightsOfPeopleWit.jpeg',
              img2: constant.resUrl + '/cover/law/2016_Book_ReconsideringConstitutionalFor.jpeg'
            },
            {
              category: 10,
              num: 24,
              img1: constant.resUrl + '/cover/ls/A978-3-319-27288-7_CoverFigure.jpg',
              img2: constant.resUrl + '/cover/ls/A978-1-4939-3743-1_CoverFigure.jpg'
            },
            {
              category: 11,
              num: 6,
              img1: constant.resUrl + '/cover/lit/2015_humanities.jpg',
              img2: constant.resUrl + '/cover/lit/A978-3-319-44388-1_CoverFigure_HTML.jpg'
            },
            {
              category: 12,
              num: 14,
              img1: constant.resUrl + '/cover/bio/2016_Book_ATimeForMetabolismAndHormones.jpeg',
              img2: constant.resUrl + '/cover/bio/2017_Book_SnowSportsTraumaAndSafety.jpeg'
            },
            {
              category: 13,
              num: 16,
              img1: constant.resUrl + '/cover/bm/2017_Book_FashionFigures.jpeg',
              img2: constant.resUrl + '/cover/bm/2018_Book_HeterogeneityHighPerformanceCo.jpeg'
            },
            {
              category: 14,
              num: 16,
              img1: constant.resUrl + '/cover/es/2017_Book_AdvancingCultureOfLivingWithLa.jpeg',
              img2: constant.resUrl + '/cover/es/2017_Book_ChinaSGasDevelopmentStrategies.jpeg'
            },
            {
              category: 15,
              num: 2,
              img1: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg',
              img2: constant.resUrl + '/cover/ms/2018_Book_ProceedingsOfTheScientific-Pra.jpeg'
            },
            {
              category: 16,
              num: 9,
              img1: constant.resUrl + '/cover/mat/2016_Book_AdvancesInDiscreteDifferential.jpeg',
              img2: constant.resUrl + '/cover/mat/2016_Book_ComputingCharacterizationsOfDr.jpeg'
            },
            {
              category: 17,
              num: 20,
              img1: constant.resUrl + '/cover/map/2013_Book_TheSouthTexasHealthStatusRevie.jpeg',
              img2: constant.resUrl + '/cover/map/2016_Book_SecondaryAnalysisOfElectronicH.jpeg'
            },
            {
              category: 18,
              num: 16,
              img1: constant.resUrl + '/cover/phi/2015_Book_TheOnlifeManifesto.jpeg',
              img2: constant.resUrl + '/cover/phi/2017_Book_Anti-VivisectionAndTheProfessi.jpeg'
            },
            {
              category: 19,
              num: 10,
              img1: constant.resUrl + '/cover/phy/2016_Book_OpticsInOurTime.jpeg',
              img2: constant.resUrl + '/cover/phy/2017_Book_InterferometryAndSynthesisInRa.jpeg'
            },
            {
              category: 20,
              num: 26,
              img1: constant.resUrl + '/cover/psa/2016_Book_EnvironmentalGovernanceInLatin.jpeg',
              img2: constant.resUrl + '/cover/psa/2017_Book_RisingPowersAndPeacebuilding.jpeg'
            },
            {
              category: 21,
              num: 3,
              img1: constant.resUrl + '/cover/psy/2015_Book_PromotingSocialDialogueInEurop.jpeg',
              img2: constant.resUrl + '/cover/psy/2015_Book_RethinkingInterdisciplinarityA.jpeg'
            },
            {
              category: 22,
              num: 1,
              img1: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg',
              img2: constant.resUrl + '/cover/sta/2013_Book_ShipAndOffshoreStructureDesign.jpeg'
            }
          ]
        //猜你喜欢-接口，这里的key为书的下标
        randomArray(9, length).forEach(key => {
            //得到的数据再用createGuessYouLike进行加工后push
            guessYouLike.push(createGuessYouLike(createData(result, key)))
        })
        //推荐-接口
        randomArray(3, length).forEach(key => {
            recommend.push(createRecommendData(createData(result, key)))
        })
        //精选-接口
        randomArray(6, length).forEach(key => {
            //精选为普通图书，不需要再次加工
            featured.push(createData(result, key))
        })
        //随机推荐-接口
        randomArray(1, length).forEach(key => {
            random.push(createData(result, key))
        })

        res.json({
            guessYouLike,
            banner,
            recommend,
            featured,
            random,
            categoryList,
            categories
        })
    }),

    conn.end()
})
//获取详情页数据
app.get('/book/detail', (req, res) => {
  const conn = connect()
  const fileName = req.query.fileName
  const sql = `select * from book where fileName='${fileName}'`
  conn.query(sql, (err, result) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '电子书详情获取失败'
      })
    } else {
      if (result && result.length === 0) {
        res.json({
          error_code: 1,
          msg: '电子书详情获取失败'
        })
      } else {
        const book = handleData(result[0])
        res.json({
          error_code: 0,
          msg: '获取成功',
          data: book
        })
      }
    }
    conn.end()
  })
})
//获取全部带封面的分类列表,搜索功能以及书城最下面显示全部功能都会调用这个接口
app.get('/book/list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'', (err, result) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '获取失败'
      })
    } else {
      result.map(item => handleData(item))
      const data = {}
      constant.category.forEach(categoryText => {
        data[categoryText] = result.filter(item => item.categoryText === categoryText)
      })
      res.json({
        error_code: 0,
        msg: '获取成功',
        data: data,
        total: result.length
      })
    }
    conn.end()
  })
})
//获取全部封面列表,用于搜索功能
app.get('/book/flat-list', (req, res) => {
  const conn = connect()
  conn.query('select * from book where cover!=\'\'', (err, result) => {
    if (err) {
      res.json({
        error_code: 1,
        msg: '获取失败'
      })
    } else {
      result.map(item => handleData(item))
      res.json({
        error_code: 0,
        msg: '获取成功',
        data: data,
        total: result.length
      })
    }
    conn.end()
  })
})
//获取书架，没缓存时默认给一个空数组即可
app.get('/book/shelf', (req, res) => {
  res.json({
    bookList: []
  })
})
const server = app.listen(3000, () => {
    const host = server.address().address
    const port = server.address().port
    //%s为字符串占位符
    console.log('server is listening at http://%s:%s', host, port)
})