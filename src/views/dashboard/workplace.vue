<template>
  <div class="ele-body ele-body-card">
    <!-- 顶部卡片 -->
    <a-card
      :bordered="false"
      :body-style="{padding: '20px'}">
      <div class="ele-cell workplace-user-card">
        <div class="ele-cell-content ele-cell">
          <a-avatar :size="68" :src="loginUser.avatar"/>
          <div class="ele-cell-content">
            <h4 class="ele-elip">早安，{{ loginUser.nickname }}，开始您一天的工作吧！</h4>
            <div class="ele-elip ele-text-secondary">
              <cloud-outlined/>
              <em>今日多云转阴，18℃ - 22℃，出门记得穿外套哦~</em>
            </div>
          </div>
        </div>
        <div class="workplace-count-group">
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <ele-tag
                color="blue"
                shape="circle"
                size="small">
                <appstore-filled/>
              </ele-tag>
              <span class="workplace-count-name">项目数</span>
            </div>
            <h2>3</h2>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <ele-tag
                color="orange"
                shape="circle"
                size="small">
                <check-square-outlined/>
              </ele-tag>
              <span class="workplace-count-name">待办项</span>
            </div>
            <h2>6 / 24</h2>
          </div>
          <div class="workplace-count-item">
            <div class="workplace-count-header">
              <ele-tag
                color="green"
                shape="circle"
                size="small">
                <bell-filled/>
              </ele-tag>
              <span class="workplace-count-name">消息</span>
            </div>
            <h2>1,689</h2>
          </div>
        </div>
      </div>
    </a-card>
    <!-- 快捷方式块 -->
    <a-row :gutter="16">
      <a-col :lg="3" :md="6" :sm="12" :xs="12">
        <a-card
          :bordered="false"
          hoverable
          :body-style="{padding: 0}">
          <router-link
            to="/system/user"
            class="app-link-block">
            <user-outlined class="app-link-icon"/>
            <div class="app-link-title">系统用户</div>
          </router-link>
        </a-card>
      </a-col>
      <a-col :lg="3" :md="6" :sm="12" :xs="12">
        <a-card
          :bordered="false"
          hoverable
          :body-style="{padding: 0}">
          <router-link
            to="/system/role"
            class="app-link-block">
            <shopping-cart-outlined
              class="app-link-icon"
              style="color: #95de64;"/>
            <div class="app-link-title">角色管理</div>
          </router-link>
        </a-card>
      </a-col>
      <a-col :lg="3" :md="6" :sm="12" :xs="12">
        <a-card
          :bordered="false"
          hoverable
          :body-style="{padding: 0}">
          <router-link
            to="/system/dept"
            class="app-link-block">
            <fund-projection-screen-outlined
              class="app-link-icon"
              style="color: #ff9c6e;"/>
            <div class="app-link-title">组织机构</div>
          </router-link>
        </a-card>
      </a-col>
      <a-col :lg="3" :md="6" :sm="12" :xs="12">
        <a-card
          :bordered="false"
          hoverable
          :body-style="{padding: 0}">
          <router-link
            to="/data/dictionary"
            class="app-link-block">
            <file-search-outlined
              class="app-link-icon"
              style="color: #b37feb;"/>
            <div class="app-link-title">字典管理</div>
          </router-link>
        </a-card>
      </a-col>
      <a-col :lg="3" :md="6" :sm="12" :xs="12">
        <a-card
          :bordered="false"
          hoverable
          :body-style="{padding: 0}">
          <router-link
            to="/member/member"
            class="app-link-block">
            <credit-card-outlined
              class="app-link-icon"
              style="color: #ffd666;"/>
            <div class="app-link-title">会员中心</div>
          </router-link>
        </a-card>
      </a-col>
      <a-col :lg="3" :md="6" :sm="12" :xs="12">
        <a-card
          :bordered="false"
          hoverable
          :body-style="{padding: 0}">
          <router-link
            to="/operate/ad"
            class="app-link-block">
            <mail-outlined
              class="app-link-icon"
              style="color: #5cdbd3;"/>
            <div class="app-link-title">广告管理</div>
          </router-link>
        </a-card>
      </a-col>
      <a-col :lg="3" :md="6" :sm="12" :xs="12">
        <a-card
          :bordered="false"
          hoverable
          :body-style="{padding: 0}">
          <router-link
            to="/message/notice"
            class="app-link-block">
            <tags-outlined
              class="app-link-icon"
              style="color: #ff85c0;"/>
            <div class="app-link-title">通知公告</div>
          </router-link>
        </a-card>
      </a-col>
      <a-col :lg="3" :md="6" :sm="12" :xs="12">
        <a-card
          :bordered="false"
          hoverable
          :body-style="{padding: 0}">
          <router-link
            to="/system/operlog"
            class="app-link-block">
            <control-outlined
              class="app-link-icon"
              style="color: #ffc069;"/>
            <div class="app-link-title">系统日志</div>
          </router-link>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <!-- 最新动态 -->
      <a-col :lg="8" :md="24" :sm="24" :xs="24">
        <a-card
          title="最新动态"
          :bordered="false"
          :body-style="{padding: 0}">
          <div
            style="height: 347px;padding: 28px 20px 0 20px;"
            class="ele-scrollbar-hover">
            <a-timeline>
              <a-timeline-item
                v-for="(item, index) in activities"
                :key="index"
                :color="item.color">
                <em>{{ item.time }}</em>
                <em>{{ item.title }}</em>
              </a-timeline-item>
            </a-timeline>
          </div>
        </a-card>
      </a-col>
      <!-- 我的任务 -->
      <a-col :lg="8" :md="24" :sm="24" :xs="24">
        <a-card
          title="我的任务"
          :bordered="false"
          :body-style="{padding: '10px 8px 10px 8px'}">
          <div class="ant-table ant-table-middle">
            <div class="ant-table-content">
              <div class="ant-table-body" style="overflow-x: auto;">
                <table style="min-width: max-content;">
                  <colgroup>
                    <col width="48"/>
                    <col width="60"/>
                    <col/>
                    <col width="80"/>
                  </colgroup>
                  <thead class="ant-table-thead">
                  <tr>
                    <th></th>
                    <th style="text-align: center;">优先级</th>
                    <th>任务名称</th>
                    <th style="text-align: center;">状态</th>
                  </tr>
                  </thead>
                  <draggable
                    tag="tbody"
                    item-key="id"
                    v-model="taskList"
                    :component-data="{class: 'ant-table-tbody'}"
                    handle=".anticon-menu"
                    :animation="300">
                    <template #item="{ element }">
                      <tr>
                        <td style="text-align: center;">
                          <menu-outlined style="cursor: move;"/>
                        </td>
                        <td style="text-align: center;padding: 8px;">
                          <ele-tag
                            :color="['red', 'orange', 'blue'][element.priority - 1]"
                            shape="circle">
                            {{ element.priority }}
                          </ele-tag>
                        </td>
                        <td>
                          <a>{{ element.taskName }}</a>
                        </td>
                        <td style="text-align: center;">
                          <span
                            :class="['ele-text-warning', 'ele-text-success', 'ele-text-info'][element.state]">
                            {{ ['未开始', '进行中', '已完成'][element.state] }}
                          </span>
                        </td>
                      </tr>
                    </template>
                  </draggable>
                </table>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <!-- 本月目标 -->
      <a-col :lg="8" :md="24" :sm="24" :xs="24">
        <a-card title="本月目标" :bordered="false">
          <div class="workplace-goal-group">
            <a-progress
              type="dashboard"
              :percent="80"
              :show-info="false"
              :width="181"
              :stroke-width="4"/>
            <div class="workplace-goal-content">
              <ele-tag
                color="blue"
                size="large"
                shape="circle">
                <trophy-outlined/>
              </ele-tag>
              <div class="workplace-goal-num">285</div>
            </div>
            <div class="workplace-goal-text">恭喜，本月目标已达标！</div>
          </div>
        </a-card>
      </a-col>
      <!-- 项目进度 -->
      <a-col :lg="16" :md="24" :sm="24" :xs="24">
        <a-card
          title="项目进度"
          :bordered="false"
          :body-style="{padding: '12px 12px 1px 12px'}">
          <a-table
            :data-source="projectList"
            row-key="id"
            :pagination="false"
            size="middle"
            :scroll="{x: 'max-content'}">
            <a-table-column
              key="index"
              align="center"
              :width="48">
              <template #default="{index}">{{ index + 1 }}</template>
            </a-table-column>
            <a-table-column
              title="项目名称"
              data-index="projectName">
              <template #default="{text}">
                <a>{{ text }}</a>
              </template>
            </a-table-column>
            <a-table-column
              title="开始时间"
              data-index="startDate"/>
            <a-table-column
              title="结束时间"
              data-index="endDate"/>
            <a-table-column
              title="状态"
              data-index="state"
              align="center"
              :width="90">
              <template #default="{text}">
                <span
                  :class="['ele-text-success', 'ele-text-danger', 'ele-text-warning', 'ele-text-info ele-text-delete'][text]">
                  {{ ['进行中', '已延期', '未开始', '已结束'][text] }}
                </span>
              </template>
            </a-table-column>
            <a-table-column
              title="进度"
              data-index="progress"
              align="center"
              :width="180">
              <template #default="{text}">
                <a-progress
                  :percent="text"
                  size="small"/>
              </template>
            </a-table-column>
          </a-table>
        </a-card>
      </a-col>
      <!-- 小组成员 -->
      <a-col :lg="8" :md="24" :sm="24" :xs="24">
        <a-card
          title="小组成员"
          :bordered="false"
          :body-style="{padding: 0}">
          <div
            v-for="(item,index) in userList"
            :key="index"
            class="ele-cell user-list-item">
            <a-avatar
              :size="46"
              :src="item.avatar"/>
            <div class="ele-cell-content">
              <div class="ele-cell-title">{{ item.name }}</div>
              <div class="ele-cell-desc">{{ item.desc }}</div>
            </div>
            <a-tag
              :color="['green', 'red'][item.state]">
              {{ ['在线', '离线'][item.state] }}
            </a-tag>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  CloudOutlined,
  AppstoreFilled,
  CheckSquareOutlined,
  BellFilled,
  UserOutlined,
  ShoppingCartOutlined,
  FundProjectionScreenOutlined,
  FileSearchOutlined,
  CreditCardOutlined,
  MailOutlined,
  TagsOutlined,
  ControlOutlined,
  MenuOutlined,
  TrophyOutlined
} from '@ant-design/icons-vue';
import draggable from 'vuedraggable';

export default {
  name: 'DashboardWorkplace',
  components: {
    CloudOutlined,
    AppstoreFilled,
    CheckSquareOutlined,
    BellFilled,
    UserOutlined,
    ShoppingCartOutlined,
    FundProjectionScreenOutlined,
    FileSearchOutlined,
    CreditCardOutlined,
    MailOutlined,
    TagsOutlined,
    ControlOutlined,
    MenuOutlined,
    TrophyOutlined,
    draggable
  },
  data() {
    return {
      // 最新动态数据
      activities: [
        {
          title: '【YourAdmin】 指派了任务 系统架构多应用设计',
          time: '20:30',
          color: 'gray'
        },
        {
          title: '【YourAdmin】 指派了任务 系统架构多应用设计',
          time: '19:30',
          color: 'gray'
        },
        {
          title: '【YourAdmin】 指派了任务 系统架构多应用设计',
          time: '18:30'
        },
        {
          title: '【YourAdmin】 指派了任务 系统架构多应用设计',
          time: '17:30'
        },
        {
          title: '【YourAdmin】 指派了任务 系统架构多应用设计',
          time: '16:30'
        },
        {
          title: '【YourAdmin】 指派了任务 系统架构多应用设计',
          time: '15:30',
          color: 'gray'
        },
        {
          title: '【YourAdmin】 指派了任务 系统架构多应用设计',
          time: '14:30',
          color: 'gray'
        },
        {
          title: '【YourAdmin】 指派了任务 系统架构多应用设计',
          time: '12:30',
          color: 'gray'
        },
        {
          title: '【YourAdmin】 指派了任务 解决项目七的bug',
          time: '11:30'
        },
        {
          title: '【YourAdmin】 指派了任务 解决项目八的bug',
          time: '10:30',
          color: 'gray'
        },
        {
          title: '【YourAdmin】 指派了任务 解决项目九的bug',
          time: '09:30',
          color: 'green'
        },
        {
          title: '【YourAdmin】 指派了任务 解决项目十的bug',
          time: '08:30',
          color: 'red'
        }
      ],
      // 我的任务数据
      taskList: [
        {
          id: 1,
          priority: 1,
          taskName: '系统架构多应用设计',
          state: 0
        },
        {
          id: 2,
          priority: 2,
          taskName: '系统架构多应用设计',
          state: 0
        },
        {
          id: 3,
          priority: 2,
          taskName: '系统架构多应用设计',
          state: 1
        },
        {
          id: 4,
          priority: 3,
          taskName: '系统架构多应用设计',
          state: 1
        },
        {
          id: 5,
          priority: 3,
          taskName: '系统架构多应用设计',
          state: 2
        },
        {
          id: 6,
          priority: 3,
          taskName: '系统架构多应用设计',
          state: 2
        }
      ],
      // 项目进度数据
      projectList: [
        {
          id: 1,
          projectName: '系统多应用架构',
          state: 0,
          startDate: '2021-12-30',
          endDate: '2021-12-30',
          progress: 30
        },
        {
          id: 2,
          projectName: '系统多应用架构',
          state: 0,
          startDate: '2021-12-30',
          endDate: '2021-12-30',
          progress: 10
        },
        {
          id: 3,
          projectName: '系统多应用架构',
          state: 1,
          startDate: '2021-11-15',
          endDate: '2021-12-30',
          progress: 60
        },
        {
          id: 4,
          projectName: '系统多应用架构',
          state: 1,
          startDate: '2021-11-15',
          endDate: '2021-12-30',
          progress: 0
        },
        {
          id: 5,
          projectName: '系统多应用架构',
          state: 2,
          startDate: '2021-11-15',
          endDate: '2021-12-30',
          progress: 100
        },
        {
          id: 6,
          projectName: '系统多应用架构',
          state: 3,
          startDate: '2021-11-15',
          endDate: '2021-12-30',
          progress: 100
        },
        {
          id: 7,
          projectName: '系统多应用架构',
          state: 3,
          startDate: '2021-11-15',
          endDate: '2021-12-30',
          progress: 100
        }
      ],
      // 小组成员数据
      userList: [
        {
          name: '【YourAdmin】',
          desc: 'UI设计师、交互专家',
          state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '野心与梦想',
          desc: '前端工程师',
          state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '野心与梦想',
          desc: '前端工程师',
          state: 0,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '【YourAdmin】',
          desc: '产品经理、【YourAdmin】',
          state: 1,
          avatar: require('@/assets/logo.png')
        },
        {
          name: '风雨踏梦行',
          desc: '组长、后端工程师',
          state: 1,
          avatar: require('@/assets/logo.png')
        }
      ]
    };
  },
  computed: {
    // 当前登录用户信息
    loginUser() {
      return this.$store.state.user.user;
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
/** 用户卡片 */
.workplace-user-card .ele-cell-content {
  overflow: hidden;
}

.workplace-user-card h4 {
  margin-bottom: 6px;
}

.workplace-count-group {
  white-space: nowrap;
  text-align: right;
  flex-shrink: 0;
}

.workplace-count-item {
  display: inline-block;
  margin: 0 4px 0 24px;
}

.workplace-count-name {
  margin-left: 8px;
}

@media screen and (max-width: 992px) {
  .workplace-count-item {
    margin: 0 2px 0 12px;
  }
}

@media screen and (max-width: 768px) {
  .workplace-user-card {
    display: block;
  }

  .workplace-count-group {
    margin-top: 8px;
  }
}

/** 快捷方式 */
.app-link-block {
  padding: 12px;
  text-align: center;
  display: block;
  color: inherit;
}

.app-link-block .app-link-icon {
  color: #69c0ff;
  font-size: 30px;
  margin: 6px 0 10px 0;
}

/** 时间轴 */
.ele-scrollbar-hover :deep(.ant-timeline-item-last > .ant-timeline-item-content) {
  min-height: auto;
}

/** 本月目标 */
.workplace-goal-group {
  padding: 48px 0;
  text-align: center;
  position: relative;
}

.workplace-goal-group .workplace-goal-content {
  position: absolute;
  top: 90px;
  left: 0;
  width: 100%;
}

.workplace-goal-group .workplace-goal-num {
  font-size: 40px;
}

/** 小组成员 */
.user-list-item {
  padding: 16px 18px;
}

.user-list-item + .user-list-item {
  border-top: 1px solid hsla(0, 0%, 60%, .15);
}

/** 表格拖拽 */
.ant-table-tbody tr.sortable-chosen {
  background: hsla(0, 0%, 60%, .1) !important;
}

.ant-table-tbody tr.sortable-chosen td {
  background: none !important;
}
</style>
