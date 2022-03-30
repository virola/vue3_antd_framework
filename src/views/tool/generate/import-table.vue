<!-- 广告编辑弹窗 -->
<template>
  <a-modal
    :width="900"
    :visible="visible"
    :confirm-loading="loading"
    :title="'导入业务表'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="ok">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <a-form
        :model="where"
        :label-col="{md: {span: 6}, sm: {span: 24}}"
        :wrapper-col="{md: {span: 18}, sm: {span: 24}}">
        <a-row>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="表名称:">
              <a-input
                v-model:value.trim="where.tableName"
                placeholder="请输入表名称"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="表描述:">
              <a-input
                v-model:value.trim="where.tableComment"
                placeholder="请输入表描述"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item style="padding-left:10px;" :wrapper-col="{span: 24}">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 表格 -->
      <ele-pro-table
        ref="table"
        row-key="tableName"
        :datasource="url"
        :columns="columns"
        :where="where"
        v-model:selection="selection"
        :scroll="{x: 'max-content'}">
      </ele-pro-table>
    </a-card>
  </a-modal>
</template>

<script>
import {createVNode} from 'vue'
import {
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
export default {
  name: 'ImportTable',
  emits: [
    'done',
    'update:visible'
  ],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表格数据接口
      url: '/generator/generate/genDbTableList',
      // 表格列配置
      columns: [
        {
          key: 'index',
          title: '编号',
          width: 48,
          align: 'center',
          fixed: 'left',
          customRender: ({index}) => this.$refs.table.tableIndex + index
        },
        {
          title: '表名称',
          dataIndex: 'tableName',
          fixed: 'left',
          align: 'center'
        },
        {
          title: '表描述',
          dataIndex: 'tableComment',
          fixed: 'left',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          align: 'center',
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          sorter: true,
          align: 'center',
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
          fixed: 'right',
          slots: {customRender: 'action'}
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 提交状态
      loading: false
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {status:1};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /* 搜索 */
    reload() {
      this.selection = [];
      this.$refs.table.reload({page: 1});
    },
    /*  重置搜索 */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },
    /**
     * 导入业务表
     */
    ok(){
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要导入所选中的业务表吗？',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          this.loading = true;
          let tableNames =  this.selection.map(d => d.tableName);
          this.$http.post('/generator/generate/importTable', tableNames).then(res => {
            this.loading = false;
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              this.updateVisible(false);
              this.$emit('done');
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            this.loading = false;
            this.$message.error(e.message);
          });
        }
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
