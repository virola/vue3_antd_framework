<!-- 顶栏消息通知图标 -->
<template>
  <a-dropdown v-model:visible="visible" :trigger="['click']">
    <a-badge :count="allNum" class="ele-notice-trigger">
      <bell-outlined style="padding: 6px;"/>
    </a-badge>
    <template #overlay>
      <div class="ant-dropdown-menu ele-notice-pop">
        <div @click.stop="">
          <a-tabs v-model:active-key="active">
            <a-tab-pane key="notice" :tab="noticeTitle" force-render>
              <a-list item-layout="horizontal" :data-source="notice">
                <template #renderItem="{item}">
                  <a-list-item>
                    <a-list-item-meta :title="item.title" :description="item.time">
                      <template #avatar>
                        <a-avatar :style="{background: item.color}">
                          <template #icon>
                            <component :is="item.icon"/>
                          </template>
                        </a-avatar>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
              <div v-if="notice.length" class="ele-cell ele-notice-actions">
                <div class="ele-cell-content" @click="clear('notice')">清空通知</div>
                <!--<a-divider type="vertical"/>
                <div class="ele-cell-content" @click="more('notice')">查看更多</div>-->
              </div>
            </a-tab-pane>
            <a-tab-pane key="message" :tab="messageTitle" force-render>
              <a-list item-layout="horizontal" :data-source="message">
                <template #renderItem="{item}">
                  <a-list-item>
                    <a-list-item-meta :title="item.title">
                      <template #avatar>
                        <a-avatar :src="item.avatar"/>
                      </template>
                      <template #description>
                        <div>{{ item.content }}</div>
                        <div>{{ item.time }}</div>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
              <div v-if="message.length" class="ele-cell ele-notice-actions">
                <div class="ele-cell-content" @click="clear('message')">清空私信</div>
                <!--<a-divider type="vertical"/>
                <div class="ele-cell-content" @click="more('message')">查看更多</div>-->
              </div>
            </a-tab-pane>
            <a-tab-pane key="todo" :tab="todoTitle" force-render>
              <a-list item-layout="horizontal" :data-source="todo">
                <template #renderItem="{item}">
                  <a-list-item>
                    <a-list-item-meta :description="item.desc">
                      <template #title>
                        <div class="ele-cell">
                          <div class="ele-cell-content">{{ item.title }}</div>
                          <a-tag :color="['', 'red', 'blue'][item.state]">
                            {{ ['未开始', '即将到期', '进行中'][item.state] }}
                          </a-tag>
                        </div>
                      </template>
                    </a-list-item-meta>
                  </a-list-item>
                </template>
              </a-list>
              <div v-if="todo.length" class="ele-cell ele-notice-actions">
                <div class="ele-cell-content" @click="clear('todo')">清空待办</div>
                <!--<a-divider type="vertical"/>
                <div class="ele-cell-content" @click="more('todo')">查看更多</div>-->
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script>
import {
  BellOutlined,
  NotificationFilled,
  PushpinFilled,
  VideoCameraFilled,
  CarryOutFilled,
  BellFilled
} from '@ant-design/icons-vue';

export default {
  name: 'EleNotice',
  components: {
    BellOutlined,
    NotificationFilled,
    PushpinFilled,
    VideoCameraFilled,
    CarryOutFilled,
    BellFilled
  },
  data() {
    return {
      visible: false,
      active: 'notice',
      notice: [
        {
          color: '#60B2FC',
          icon: 'NotificationFilled',
          title: '你收到了一封14份新周报',
          time: '2020-07-27 18:30:18'
        },
        {
          color: '#F5686F',
          icon: 'PushpinFilled',
          title: '【YourAdmin】同意了你的请假申请',
          time: '2020-07-27 09:08:36'
        },
        {
          color: '#7CD734',
          icon: 'VideoCameraFilled',
          title: '【YourAdmin】邀请你参加视频会议',
          time: '2020-07-26 18:30:01'
        },
        {
          color: '#FAAD14',
          icon: 'CarryOutFilled',
          title: '你推荐的【YourAdmin】已通过第三轮面试',
          time: '2020-07-25 16:38:46'
        },
        {
          color: '#2BCACD',
          icon: 'BellFilled',
          title: '你的6月加班奖金已发放',
          time: '2020-07-25 11:03:31'
        }
      ],
      message: [
        {
          avatar: require('@/assets/logo.png'),
          title: '【YourAdmin】 评论了你的日志',
          content: '写的不错, 以后多多向你学习~',
          time: '2020-07-27 18:30:18'
        },
        {
          avatar: require('@/assets/logo.png'),
          title: '【YourAdmin】 点赞了你的日志',
          content: '写的不错, 以后多多向你学习~',
          time: '2020-07-27 09:08:36'
        },
        {
          avatar: require('@/assets/logo.png'),
          title: '【YourAdmin】 评论了你的周报',
          content: '写的不错, 以后多多向你学习~',
          time: '2020-07-26 18:30:01'
        },
        {
          avatar: require('@/assets/logo.png'),
          title: '【YourAdmin】 点赞了你的周报',
          content: '写的不错, 以后多多向你学习~',
          time: '2021-12-25 11:03:31'
        }
      ],
      todo: [
        {
          state: 0,
          title: '【YourAdmin】的请假审批',
          desc: '【YourAdmin】在 12-15 18:30 提交的请假申请'
        },
        {
          state: 1,
          title: '多应用架构全新重构升级',
          desc: '需要在 2021-12-30 之前完成'
        },
        {
          state: 2,
          title: '系统配置中心功能升级',
          desc: '需要在 2021-10-28 10:30 前完成'
        },
        {
          state: 2,
          title: 'framework发布新版本v2.0.0',
          desc: '需要在 2021-12-20 15:30 前完成'
        }
      ]
    };
  },
  computed: {
    // 通知标题
    noticeTitle() {
      return this.notice.length ? `通知(${this.notice.length})` : '通知';
    },
    // 私信标题
    messageTitle() {
      return this.message.length ? `私信(${this.message.length})` : '私信';
    },
    // 待办标题
    todoTitle() {
      return this.todo.length ? `待办(${this.todo.length})` : '待办';
    },
    // 所有消息数量
    allNum() {
      return this.notice.length + this.message.length + this.todo.length;
    }
  },
  methods: {
    /* 清空消息 */
    clear(type) {
      if (type === 'notice') {
        this.notice = [];
      } else if (type === 'message') {
        this.message = [];
      } else if (type === 'todo') {
        this.todo = [];
      }
    },
    /* 查看更多 */
    // more(type) {
    //   this.visible = false;
    //   if (this.$route.path !== '/user/message' || this.$route.query.type !== type) {
    //     this.$router.push({path: '/user/message', query: {type: type}});
    //   }
    // }
  }
}
</script>

<style>
.ele-notice-trigger.ant-badge {
  color: inherit;
}

.ele-notice-pop.ant-dropdown-menu {
  padding: 0;
  width: 336px;
  max-width: 100%;
  margin-top: 11px;
}

/* 内容 */
.ele-notice-pop .ant-tabs-nav-wrap {
  text-align: center;
}

.ele-notice-pop .ant-list-item {
  padding-left: 24px;
  padding-right: 24px;
  transition: background-color .3s;
  cursor: pointer;
}

.ele-notice-pop .ant-list-item:hover {
  background: hsla(0, 0%, 60%, .05);
}

.ele-notice-pop .ant-tag {
  margin: 0;
}

/* 操作按钮 */
.ele-notice-pop .ele-notice-actions {
  border-top: 1px solid hsla(0, 0%, 60%, .15);
}

.ele-notice-pop .ele-notice-actions > .ele-cell-content {
  line-height: 46px;
  text-align: center;
  transition: background-color .3s;
  cursor: pointer;
}

.ele-notice-pop .ele-notice-actions > .ele-cell-content:hover {
  background: hsla(0, 0%, 60%, .05);
}
</style>
