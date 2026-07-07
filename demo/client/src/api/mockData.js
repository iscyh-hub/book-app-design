// 汇读 Demo 静态版 Mock 数据
// 数据来源：demo/server/seed/seed.sql

const MOCK_USER = {
  user_id: 1,
  username: 'test',
  nickname: '聒聒',
  avatar: '/uploads/avatars/头像.jpg',
  email: 'test@huidu.example.com',
  phone: '13800138000',
  is_vip: 0,
  vip_expire_date: null,
}

const MOCK_TOKEN = 'mock_token_huidu_demo_static'

const CATEGORIES = [
  { category_id: 1, parent_id: 0, name: '文学', icon: '/uploads/categories/文学.JPG', sort_order: 1, status: 1 },
  { category_id: 2, parent_id: 0, name: '历史', icon: '/uploads/categories/历史.JPG', sort_order: 2, status: 1 },
  { category_id: 3, parent_id: 0, name: '哲学', icon: '/uploads/categories/哲学.JPG', sort_order: 3, status: 1 },
  { category_id: 4, parent_id: 0, name: '童书', icon: '/uploads/categories/童书.JPG', sort_order: 4, status: 1 },
  { category_id: 5, parent_id: 0, name: '科普', icon: '/uploads/categories/科普.JPG', sort_order: 5, status: 1 },
]

const BOOKS = [
  {
    book_id: 1,
    title: '简爱',
    author: '夏洛蒂·勃朗特',
    cover: '/uploads/covers/简爱.png',
    category_id: 1,
    price: 19.90,
    original_price: 39.80,
    is_ebook: 1,
    is_audiobook: 1,
    summary: '《简·爱》是一部具有自传色彩的作品，讲述了一位孤女在各种磨难中不断追求自由与尊严，坚持自我，最终获得幸福的故事。',
    publisher: '人民文学出版社',
    isbn: '9787020042490',
    word_count: 420000,
    status: 1,
  },
  {
    book_id: 2,
    title: '傲慢与偏见',
    author: '简·奥斯汀',
    cover: '/uploads/covers/你是人间四月天.png',
    category_id: 1,
    price: 18.50,
    original_price: 36.00,
    is_ebook: 1,
    is_audiobook: 1,
    summary: '《傲慢与偏见》描写了小乡绅班纳特家五个女儿的爱情与婚姻，以伊丽莎白和达西的感情为主线，探讨了爱情、财产与社会阶层。',
    publisher: '上海译文出版社',
    isbn: '9787532739256',
    word_count: 380000,
    status: 1,
  },
  {
    book_id: 3,
    title: '论语',
    author: '孔子弟子及再传弟子',
    cover: '/uploads/covers/论语.png',
    category_id: 3,
    price: 12.00,
    original_price: 24.00,
    is_ebook: 1,
    is_audiobook: 0,
    summary: '《论语》是儒家经典之一，记录孔子及其弟子言行，集中体现了孔子的政治主张、伦理思想、道德观念和教育原则。',
    publisher: '中华书局',
    isbn: '9787101070248',
    word_count: 160000,
    status: 1,
  },
  {
    book_id: 4,
    title: '资治通鉴',
    author: '司马光',
    cover: '/uploads/covers/资治通鉴.png',
    category_id: 2,
    price: 29.90,
    original_price: 58.00,
    is_ebook: 1,
    is_audiobook: 0,
    summary: '《资治通鉴》是一部编年体通史，记载了从战国到五代共1362年的历史，是中国古代史学的瑰宝。',
    publisher: '中华书局',
    isbn: '9787101001327',
    word_count: 3000000,
    status: 1,
  },
  {
    book_id: 5,
    title: '格列佛游记',
    author: '乔纳森·斯威夫特',
    cover: '/uploads/covers/格列佛游记.png',
    category_id: 4,
    price: 15.00,
    original_price: 30.00,
    is_ebook: 1,
    is_audiobook: 1,
    summary: '《格列佛游记》通过外科医生格列佛在小人国、大人国等奇幻国度的经历，讽刺了当时的英国社会和政治。',
    publisher: '译林出版社',
    isbn: '9787544722679',
    word_count: 250000,
    status: 1,
  },
  {
    book_id: 6,
    title: '昆虫记',
    author: '法布尔',
    cover: '/uploads/covers/奇妙的昆虫.png',
    category_id: 5,
    price: 16.80,
    original_price: 33.60,
    is_ebook: 1,
    is_audiobook: 0,
    summary: '《昆虫记》是法国昆虫学家法布尔的科普巨著，以生动的笔触描绘了昆虫的生活习性和生命历程。',
    publisher: '花城出版社',
    isbn: '9787536062453',
    word_count: 280000,
    status: 1,
  },
]

const CHAPTERS = [
  { chapter_id: 1, book_id: 1, chapter_no: 1, title: '第一章 盖茨黑德府', content: '那天，再出去散步是不可能了。不错，早上我们还在光秃秃的灌木林中漫步了一个小时，可是打午饭起，便刮起了冬日凛冽的寒风，随之而来的是阴沉的乌云和透骨的冷雨，这一来，自然也就无须再出去走动了。\n\n我倒是挺高兴的。我从来不喜欢远途散步，尤其在寒冷的下午。我觉得，在阴冷的黄昏时分回家实在可怕，手指和脚趾都冻僵了，还要挨保姆贝茜的责骂，弄得心里挺不高兴。', audio_url: null, is_free: 1 },
  { chapter_id: 2, book_id: 1, chapter_no: 2, title: '第二章 红房子', content: '几分钟以后，我回到了自己的铺位。这时我的情绪已经平静多了，正在沉沉睡去。可是一声尖锐的叫声划破了深夜的寂静，接着整个房子里充满了嘈杂的人声和脚步的奔跑声。\n\n我感到又有什么灾祸临头了，赶忙把被子蒙住头，但不久又忍不住竖起耳朵倾听。', audio_url: null, is_free: 1 },
  { chapter_id: 3, book_id: 1, chapter_no: 3, title: '第三章 病中', content: '接下来的三天三夜，我是在神志昏迷中度过的。我只知道有人守在我身边，给我喂药，扶我喝水，另外还常常听到有人在低声哭泣。\n\n等我清醒过来，我看见贝茜坐在火炉旁边，膝上放着一本《格列佛游记》，正在给我念里面的故事。', audio_url: null, is_free: 1 },
  { chapter_id: 4, book_id: 2, chapter_no: 1, title: '第一章', content: '凡是有钱的单身汉，总想娶位太太，这已经成了一条举世公认的真理。这样的单身汉，每逢新搬到一个地方，四邻八舍虽然完全不了解他的性情如何，见解如何，可是，既然这样的一条真理早已在人们心目中根深蒂固，因此人们总是把他看作自己某一个女儿理所应得的一笔财产。\n\n“亲爱的贝内特先生，”有一天，贝内特太太对她的丈夫说，“你听说内瑟菲尔德庄园租出去了吗？”', audio_url: null, is_free: 1 },
  { chapter_id: 5, book_id: 2, chapter_no: 2, title: '第二章', content: '贝内特先生是第一批去拜访宾利先生的人当中的一员。他虽然一向当着太太的面扬言要去拜访，实际上却是拖到第二个星期才成行。\n\n太太和小姐们那时已经在他背后议论了整整两个星期了，直到他拜访归来的那一天晚上，全家人才终于听到了一些有关宾利先生的具体情况。', audio_url: null, is_free: 1 },
  { chapter_id: 6, book_id: 2, chapter_no: 3, title: '第三章', content: '班纳特太太只许老头子嫌了一个晚上，可是这个晚上已经够她用心思了。第二天早晨，她便打发大女儿吉英去内瑟菲尔德庄园探望宾利小姐，同她作一次短时间的会晤。\n\n这次拜访注定要产生意想不到的后果。', audio_url: null, is_free: 1 },
  { chapter_id: 7, book_id: 3, chapter_no: 1, title: '学而篇第一', content: '子曰：“学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？”\n\n有子曰：“其为人也孝弟，而好犯上者，鲜矣；不好犯上，而好作乱者，未之有也。君子务本，本立而道生。孝弟也者，其为仁之本与！”', audio_url: null, is_free: 1 },
  { chapter_id: 8, book_id: 3, chapter_no: 2, title: '为政篇第二', content: '子曰：“为政以德，譬如北辰，居其所而众星共之。”\n\n子曰：“《诗》三百，一言以蔽之，曰：‘思无邪’。”\n\n子曰：“道之以政，齐之以刑，民免而无耻。道之以德，齐之以礼，有耻且格。”', audio_url: null, is_free: 1 },
  { chapter_id: 9, book_id: 3, chapter_no: 3, title: '八佾篇第三', content: '孔子谓季氏：“八佾舞于庭，是可忍也，孰不可忍也？”\n\n三家者以《雍》彻。子曰：“‘相维辟公，天子穆穆’，奚取于三家之堂？”\n\n子曰：“人而不仁，如礼何？人而不仁，如乐何？”', audio_url: null, is_free: 1 },
  { chapter_id: 10, book_id: 4, chapter_no: 1, title: '三家分晋', content: '威烈王二十三年，初命晋大夫魏斯、赵籍、韩虔为诸侯。\n\n臣光曰：臣闻天子之职莫大于礼，礼莫大于分，分莫大于名。何谓礼？纪纲是也。何谓分？君、臣是也。何谓名？公、侯、卿、大夫是也。\n\n夫以四海之广，兆民之众，受制于一人，虽有绝伦之力，高世之智，莫不奔走而服役者，岂非以礼为之纪纲哉！', audio_url: null, is_free: 1 },
  { chapter_id: 11, book_id: 4, chapter_no: 2, title: '周纪一 韩赵魏', content: '初，智宣子将以瑶为后，智果曰：“不如宵也。瑶之贤于人者五，其不逮者一也。美鬓长大则贤，射御足力则贤，伎艺毕给则贤，巧文辩惠则贤，强毅果敢则贤；如是而甚不仁。夫以其五贤陵人而以不仁行之，其谁能待之？”', audio_url: null, is_free: 1 },
  { chapter_id: 12, book_id: 4, chapter_no: 3, title: '晋阳之围', content: '智伯帅韩、魏以攻赵，围晋阳。智伯行水，魏桓子御，韩康子骖乘。智伯曰：“吾乃今知水可以亡人国也。”桓子肘康子，康子履桓子之跗，以汾水可以灌安邑，绛水可以灌平阳也。', audio_url: null, is_free: 1 },
  { chapter_id: 13, book_id: 5, chapter_no: 1, title: '第一章 利立浦特', content: '我父亲在诺丁汉郡有一份小小的产业；我在他的五个儿子中，排行老三。十四岁那年，他送我进了剑桥大学的伊曼纽尔学院。我在那儿住了三年，刻苦攻读。\n\n由于家道中落，我只得中断学业，去伦敦著名的外科医生詹姆斯·贝茨先生手下当学徒。', audio_url: null, is_free: 1 },
  { chapter_id: 14, book_id: 5, chapter_no: 2, title: '第二章 小人国的风俗', content: '我醒来时，太阳已经出来了。我想翻身，却发现自己动弹不得：我的四肢和身子被无数细线牢牢地绑在地上。\n\n我微微抬起头来，看见许多不足六英寸高的小人，他们成群结队地站在我的身上、手臂上和头发上。', audio_url: null, is_free: 1 },
  { chapter_id: 15, book_id: 5, chapter_no: 3, title: '第三章 王宫觐见', content: '皇帝的宫殿坐落在城市的中心，主要宫殿大约有欧洲的教堂那么大。我费了很大力气才爬进去。\n\n皇帝陛下坐在宝座上，头顶戴着镶满珠宝的皇冠，手中握着权杖，气度非凡。', audio_url: null, is_free: 1 },
  { chapter_id: 16, book_id: 6, chapter_no: 1, title: '蝉和蚂蚁的寓言', content: '夏天，蝉在树上高声歌唱，蚂蚁却在忙碌地搬运食物。传统寓言总是把蝉描绘成懒惰的乞丐，而蚂蚁则是勤劳的代表。\n\n但法布尔通过长期观察告诉我们，事实恰恰相反：蚂蚁才是掠夺者，它们常常成群结队地抢劫蝉的劳动成果。', audio_url: null, is_free: 1 },
  { chapter_id: 17, book_id: 6, chapter_no: 2, title: '螳螂捕食', content: '螳螂是昆虫界的猎手。它静静地伏在草丛中，两只带锯齿的前足像祈祷一样收在胸前，等待着猎物的到来。\n\n当一只毫无防备的蝗虫跳过时，螳螂会猛然伸出前足，用锋利的刺将猎物紧紧抓住，整个过程快如闪电。', audio_url: null, is_free: 1 },
  { chapter_id: 18, book_id: 6, chapter_no: 3, title: '圣甲虫的粪球', content: '圣甲虫热爱粪球。它们把动物的粪便滚成圆圆的球，推到地下藏起来，作为幼虫的食物。\n\n粪球必须滚得足够圆，否则在搬运途中容易散开。圣甲虫用后腿倒推着粪球，头朝下，一步一步地倒退着前行。', audio_url: null, is_free: 1 },
]

// 统一响应包装
const ok = (data) => Promise.resolve({ code: 200, message: 'success', data })

// 延迟模拟网络请求
const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

// 书架数据存在 localStorage， key
const BOOKSHELF_KEY = 'huidu_mock_bookshelf'

const getBookshelfStorage = () => {
  try {
    const raw = localStorage.getItem(BOOKSHELF_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const setBookshelfStorage = (list) => {
  localStorage.setItem(BOOKSHELF_KEY, JSON.stringify(list))
}

// ---------- 用户模块 ----------
export const mockLogin = async (data) => {
  await delay()
  localStorage.setItem('huidu_token', MOCK_TOKEN)
  return ok({
    user_id: MOCK_USER.user_id,
    nickname: MOCK_USER.nickname,
    avatar: MOCK_USER.avatar,
    is_vip: MOCK_USER.is_vip,
    token: MOCK_TOKEN,
  })
}

export const mockRegister = async (data) => {
  await delay()
  return ok({ user_id: 2, username: data.username, nickname: data.nickname || data.username })
}

export const mockGetProfile = async () => {
  await delay()
  return ok({ ...MOCK_USER })
}

export const mockUpdateProfile = async (data) => {
  await delay()
  Object.assign(MOCK_USER, data)
  return ok({ ...MOCK_USER })
}

// ---------- 图书模块 ----------
export const mockGetCategories = async () => {
  await delay()
  return ok([...CATEGORIES])
}

export const mockGetBooks = async (params = {}) => {
  await delay(300)
  const { category_id, keyword, page = 1, size = 20 } = params
  let list = BOOKS.map((b) => ({ ...b }))

  if (category_id) {
    list = list.filter((b) => String(b.category_id) === String(category_id))
  }

  if (keyword) {
    const k = keyword.toLowerCase()
    list = list.filter((b) => b.title.toLowerCase().includes(k) || b.author.toLowerCase().includes(k))
  }

  const total = list.length
  const start = (page - 1) * size
  const paged = list.slice(start, start + size)

  return ok({ total, page: Number(page), size: Number(size), list: paged })
}

export const mockGetBookDetail = async (id) => {
  await delay()
  const book = BOOKS.find((b) => String(b.book_id) === String(id))
  if (!book) {
    const err = new Error('图书不存在')
    err.response = { status: 404 }
    throw err
  }
  const chapters = CHAPTERS.filter((c) => String(c.book_id) === String(id)).map((c) => ({
    chapter_id: c.chapter_id,
    chapter_no: c.chapter_no,
    title: c.title,
    is_free: c.is_free,
  }))
  return ok({ ...book, chapters })
}

export const mockGetChapter = async (bookId, chapterId) => {
  await delay()
  const chapter = CHAPTERS.find(
    (c) => String(c.book_id) === String(bookId) && String(c.chapter_id) === String(chapterId)
  )
  if (!chapter) {
    const err = new Error('章节不存在')
    err.response = { status: 404 }
    throw err
  }

  const bookChapters = CHAPTERS.filter((c) => String(c.book_id) === String(bookId))
  const idx = bookChapters.findIndex((c) => String(c.chapter_id) === String(chapterId))

  return ok({
    ...chapter,
    prev_chapter_id: idx > 0 ? bookChapters[idx - 1].chapter_id : null,
    next_chapter_id: idx < bookChapters.length - 1 ? bookChapters[idx + 1].chapter_id : null,
  })
}

// ---------- 书架模块 ----------
export const mockGetBookshelf = async () => {
  await delay()
  const shelf = getBookshelfStorage()
  return ok(
    shelf.map((item) => {
      const book = BOOKS.find((b) => String(b.book_id) === String(item.book_id))
      return book
        ? {
            id: item.id,
            book_id: book.book_id,
            title: book.title,
            author: book.author,
            cover: book.cover,
            progress: item.progress || 0,
            last_chapter_id: item.last_chapter_id,
          }
        : item
    })
  )
}

export const mockAddToBookshelf = async (data) => {
  await delay()
  const shelf = getBookshelfStorage()
  const exists = shelf.find((item) => String(item.book_id) === String(data.book_id))
  if (!exists) {
    const book = BOOKS.find((b) => String(b.book_id) === String(data.book_id))
    shelf.push({
      id: Date.now(),
      book_id: Number(data.book_id),
      progress: 0,
      last_chapter_id: book ? book.chapters?.[0]?.chapter_id || 1 : 1,
      is_favorite: data.is_favorite || 1,
    })
    setBookshelfStorage(shelf)
  }
  return ok(null)
}

export const mockRemoveFromBookshelf = async (bookId) => {
  await delay()
  const shelf = getBookshelfStorage().filter((item) => String(item.book_id) !== String(bookId))
  setBookshelfStorage(shelf)
  return ok(null)
}

export const mockSaveProgress = async (data) => {
  await delay()
  const shelf = getBookshelfStorage()
  const item = shelf.find((item) => String(item.book_id) === String(data.book_id))
  if (item) {
    item.last_chapter_id = Number(data.chapter_id)
    item.progress = data.progress || item.progress || 0
    setBookshelfStorage(shelf)
  }
  return ok(null)
}
