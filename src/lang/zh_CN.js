/**
 * 简体中文
 */
export default {
  route: {
    dashboard: {
      _name: '控制面板',
      workplace: {_name: '工作台'},
      analysis: {_name: '分析页'},
      monitor: {_name: '监控页'}
    },
    system: {
      _name: '系统管理',
      user: {
        _name: '用户管理',
        info: {_name: ''}
      },
      role: {_name: '角色管理'},
      menu: {_name: '菜单管理'},
      dictionary: {_name: '字典管理'},
      organization: {_name: '机构管理'},
      loginRecord: {_name: '登录日志'},
      operRecord: {_name: '操作日志'}
    },
    exception: {
      _name: '异常页面',
      '403': {_name: '403'},
      '404': {_name: '404'},
      '500': {_name: '500'}
    },
    user: {
      _name: '个人中心',
      profile: {_name: '个人资料'},
    },
    example: {
      _name: '经典实例',
      document: {_name: '案卷调整'},
      choose: {_name: '批量选择'},
    },
  },
  layout: {
    home: '主页',
    header: {
      profile: '个人中心',
      password: '修改密码',
      logout: '退出登录'
    },
    footer: {
      website: '官网',
      document: '文档',
      authorization: '授权',
      copyright: 'Copyright © 2018~2022 XXX'
    },
    logout: {
      title: '提示',
      message: '确定要退出登录吗?'
    }
  },
  login: {
    title: '微服务前后端分离Antd+Vue旗舰版',
    username: '请输入登录账号',
    password: '请输入登录密码',
    captcha: '请输入验证码',
    remember: '记住密码',
    forget: '忘记密码',
    login: '登录',
    loading: '登录中'
  }
}
