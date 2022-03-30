/**
 * 繁体中文
 */
export default {
  route: {
    dashboard: {
      _name: '控制面板',
      workplace: {_name: '工作臺'},
      analysis: {_name: '分析頁'},
      monitor: {_name: '監控頁'}
    },
    system: {
      _name: '系統管理',
      user: {
        _name: '用戶管理',
        info: {_name: ''}
      },
      role: {_name: '角色管理'},
      menu: {_name: '選單管理'},
      dictionary: {_name: '字典管理'},
      organization: {_name: '機构管理'},
      loginRecord: {_name: '登入日誌'},
      operRecord: {_name: '操作日誌'}
    },
    exception: {
      _name: '异常頁面',
      '403': {_name: '403'},
      '404': {_name: '404'},
      '500': {_name: '500'}
    },
    user: {
      _name: '個人中心',
      profile: {_name: '個人資料'},
    },
    example: {
      _name: '經典實例',
      document: {_name: '案卷調整'},
      choose: {_name: '批量選擇'},
    },
  },
  layout: {
    home: '主頁',
    header: {
      profile: '個人中心',
      password: '修改密碼',
      logout: '安全登出'
    },
    footer: {
      website: '官網',
      document: '檔案',
      authorization: '授權',
      copyright: 'Copyright © 2018~2022 XXX'
    },
    logout: {
      title: '詢問',
      message: '確定要登出嗎?'
    }
  },
  login: {
    title: '微服务前后端分离Antd+Vue旗舰版',
    username: '請輸入登入帳號',
    password: '請輸入登入密碼',
    captcha: '請輸入驗證碼',
    remember: '記住密碼',
    forget: '忘記密碼',
    login: '登入',
    loading: '登入中'
  }
}
