<template>
  <div class="ele-body">
    <a-card :bordered="false" class="user-message-card">
      <div class="ele-cell ele-cell-align-top">
        <a-menu
          v-model:selected-keys="active"
          mode="inline"
          @select="onSelect">
          <a-menu-item key="0">全部消息</a-menu-item>
          <a-menu-item key="1">系统通知</a-menu-item>
          <a-menu-item key="2">用户私信</a-menu-item>
          <a-menu-item key="3">代办事项</a-menu-item>
        </a-menu>
        <div class="ele-cell-content">
          <!-- 表格 -->
          <ele-pro-table
            ref="table"
            row-key="id"
            :datasource="data"
            :columns="columns"
            :loading="loading"
            v-model:selection="selection"
            :scroll="{x: 'max-content'}"
            @refresh="query">
            <template #toolbar>
              <a-space>
                <a-button type="primary" @click="read">标记已读</a-button>
                <a-button type="primary" @click="readAll">全部已读</a-button>
                <a-button type="primary" danger @click="removeBatch">删除消息</a-button>
              </a-space>
            </template>
            <template #state="{ text }">
              <span :class="['ele-text-warning','ele-text-info'][text]">
                {{ ['未读', '已读'][text] }}
              </span>
            </template>
            <template #action="{ record }">
              <a-space>
                <a @click="view(record)">查看</a>
                <a-divider type="vertical"/>
                <a-popconfirm
                  title="确定要删除此消息吗？"
                  @confirm="remove(record)">
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </ele-pro-table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';

export default {
  name: 'UserMessage',
  data() {
    return {
      active: ['0'],
      // 表格列配置
      columns: [
        {
          key: 'index',
          width: 38,
          customRender: ({index}) => this.$refs.table.tableIndex + index
        },
        {
          title: '标题内容',
          dataIndex: 'title'
        },
        {
          title: '时间',
          dataIndex: 'time'
        },
        {
          title: '状态',
          dataIndex: 'state',
          slots: {customRender: 'state'}
        },
        {
          title: '操作',
          key: 'action',
          width: 120,
          align: 'center',
          slots: {customRender: 'action'}
        }
      ],
      // 表格数据
      data: [],
      // 表格加载状态
      loading: true,
      // 表格选中数据
      selection: [],
      // 全部消息数据
      allData: []
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    /* 表格查询数据 */
    query() {
      this.loading = true;
      setTimeout(() => {
        this.allData = [
          {id: 1, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 0},
          {id: 2, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 0},
          {id: 3, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 0},
          {id: 4, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 0},
          {id: 5, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 1},
          {id: 6, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 1},
          {id: 7, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 1},
          {id: 8, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 1},
          {id: 9, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 1},
          {id: 10, title: '你有两条任务待完成，不要忘了哦~', type: 3, time: '2022-07-24 11:35', state: 1},
          {id: 11, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 0},
          {id: 12, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 0},
          {id: 13, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 0},
          {id: 14, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 1},
          {id: 15, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 1},
          {id: 16, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 1},
          {id: 17, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 1},
          {id: 18, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 1},
          {id: 19, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 1},
          {id: 20, title: '古吉拉特给你发来了一条私信', type: 2, time: '2022-07-24 11:35', state: 1},
          {id: 21, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 0},
          {id: 22, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 0},
          {id: 23, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 1},
          {id: 24, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 1},
          {id: 25, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 1},
          {id: 26, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 1},
          {id: 27, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 1},
          {id: 28, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 1},
          {id: 29, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 1},
          {id: 30, title: '新版本发布，欢迎体验', type: 1, time: '2022-07-24 11:35', state: 1}
        ];
        this.onSelect();
        this.loading = false;
      }, 300);
    },
    /* 左侧选中 */
    onSelect() {
      this.clearChoose();
      if (this.active.some(d => d === '0')) {
        this.data = this.allData;
      } else {
        this.data = this.allData.filter(d => this.active.some(t => t === String(d.type)));
      }
      this.$refs.table.reload({page: 1});
    },
    /* 清空选择 */
    clearChoose() {
      this.selection = [];
    },
    /* 删除单个 */
    remove(row) {
      this.allData.splice(this.allData.indexOf(row), 1);
      this.$message.success('删除成功');
      this.onSelect();
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的消息吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          this.selection.forEach(d => {
            this.allData.splice(this.allData.findIndex(t => t.id === d.id), 1);
          });
          this.onSelect();
        }
      });
    },
    /* 标记已读 */
    read() {
      if (this.selection.length === 0) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.selection.forEach(d => {
        d.state = 1;
      });
      this.clearChoose();
    },
    /* 全部已读 */
    readAll() {
      this.data.forEach(d => {
        d.state = 1;
      });
    },
    /* 查看 */
    view(row) {
      console.log(row);
      this.$message.success('点击了查看');
    }
  }
}
</script>

<style scoped>
.user-message-card :deep(.ant-card-body) {
  padding: 0;
}

.user-message-card .ant-menu {
  width: 150px;
  padding-top: 16px;
}

.user-message-card .ant-menu + .ele-cell-content {
  padding: 24px;
}

@media screen and (max-width: 768px) {
  .user-message-card .ant-menu {
    display: none;
  }
}
</style>
