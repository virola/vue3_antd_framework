<template>
  <div class="ele-body">
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
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="importTable()">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>导入业务表</span>
            </a-button>
            <a-button type="danger" @click="removeBatch">
              <template #icon>
                <delete-outlined/>
              </template>
              <span>删除</span>
            </a-button>
            <a-button type="primary" @click="batchGenerate()">
              <template #icon>
                <download-outlined/>
              </template>
              <span>批量生成</span>
            </a-button>
          </a-space>
        </template>
        <!-- 操作栏 -->
        <template #action="{ record }">
          <a-space>
            <a-popconfirm
              title="确定要生成当前模块吗？生成后将覆盖已存在的模块文件!"
              @confirm="generate(record)">
              <a class="ele-text-orange">一键生成</a>
            </a-popconfirm>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除此业务表吗？"
              @confirm="remove(record)">
              <a class="ele-text-danger">删除</a>
            </a-popconfirm>
            
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>

  <!-- 导入弹窗 -->
  <import-table
    v-model:visible="showImport"
    :data="current"
    @done="reload"/>
</template>

<script>
import {createVNode} from 'vue'

import {
  PlusOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import { mapGetters } from "vuex";
import importTable from "./import-table";

export default ({
  name: 'Generate',
  components: {
    PlusOutlined,
    DeleteOutlined,
    DownloadOutlined,
    importTable
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/generator/generate/index',
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
          title: '业务表名称',
          dataIndex: 'tableName',
          align: 'center'
        },
        {
          title: '表描述',
          dataIndex: 'tableComment',
          align: 'center'
        },
        {
          title: '实体类名称',
          dataIndex: 'className',
          align: 'center'
        },
        {
          title: '使用模板',
          dataIndex: 'tplCategory',
          align: 'center'
        },
        {
          title: '包路径',
          dataIndex: 'packageName',
          align: 'center'
        },
        {
          title: '模块名称',
          dataIndex: 'moduleName',
          align: 'center'
        },
        {
          title: '业务名称',
          dataIndex: 'businessName',
          align: 'center'
        },
        {
          title: '业务标题',
          dataIndex: 'functionName',
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center',
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          fixed: 'right',
          slots: {customRender: 'action'}
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 是否显示导入弹出窗
      showImport: false,
    };
  },
  methods: {
    /* 搜索 */
    reload() {
      this.selection = [];
      this.$refs.table.reload({});
    },
    /*  重置搜索 */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },
    /**
     * 导入表
     */
    importTable(){
      this.showImport = true;
    },
    /* 删除单个 */
    remove(row) {
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/generator/generate/delete/' + [row.id]).then(res => {
        hide();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        hide();
        this.$message.error(e.message);
      });
    },
    /* 批量删除 */
    removeBatch() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的职级吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/generator/generate/delete/' + this.selection.map(d => d.id)).then(res => {
            hide();
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              this.reload();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            hide();
            this.$message.error(e.message);
          });
        }
      });
    },
    /**
     * 生成模块代码
     */
    generate(record){
      const tableNames = record.tableName || this.tableNames.join(',');
      if (tableNames == "") {
        this.$message.error("请选择要生成的数据");
        return;
      }
      const hide = this.$message.loading('请求中..', 0);
      this.$http.post('/generator/generate/batchGenCode', {tableNames: tableNames}).then(res => {
        hide();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        hide();
        this.$message.error(e.message);
      });
    },
    /* 批量生成 */
    batchGenerate() {
      if (!this.selection.length) {
        this.$message.error('请至少选择一条数据');
        return;
      }
      this.$confirm({
        title: '提示',
        content: '确定要批量生成当前选择的模块吗?生成将覆盖已有的文件',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.post('/generator/generate/batchGenCode', {tableNames: this.selection.map(d => d.tableName).join(',')}).then(res => {
            hide();
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              this.reload();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch(e => {
            hide();
            this.$message.error(e.message);
          });
        }
      });
    },
  }
});
</script>

<style scoped>
</style>
