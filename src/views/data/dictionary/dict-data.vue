<template>
  <!-- 表格 -->
  <ele-pro-table
    ref="table"
    row-key="id"
    :datasource="url"
    :columns="columns"
    :where="where"
    tool-class="ele-toolbar-form"
    v-model:selection="selection"
    :scroll="{x: 'max-content'}">
    <template #status="{ text, record }">
      <a-switch
        :checked="text===1"
        @change="(checked) => editStatus(checked, record)"/>
    </template>
    <template #toolbar>
      <a-row :gutter="16">
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-input
            v-model:value.trim="where.name"
            placeholder="请输入字典项名称"
            allow-clear/>
        </a-col>
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-space size="middle">
            <a-button type="primary" @click="reload">查询</a-button>
            <a-button type="primary" @click="openEdit()" v-if="permission.includes('sys:dictionary:add')">新建</a-button>
            <a-button type="danger" @click="removeBatch" v-if="permission.includes('sys:dictionary:dall')">删除</a-button>
          </a-space>
        </a-col>
      </a-row>
    </template>
    <!-- 操作栏 -->
    <template #action="{ record }">
      <a-space>
        <a @click="openEdit(record)" v-if="permission.includes('sys:dictionary:edit')">修改</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确定要删除此字典项吗？"
          @confirm="remove(record)">
          <a class="ele-text-danger" v-if="permission.includes('sys:dictionary:delete')">删除</a>
        </a-popconfirm>
      </a-space>
    </template>
  </ele-pro-table>
  <!-- 编辑弹窗 -->
  <dict-data-edit
    v-model:visible="showEdit"
    :data="current"
    :dict-id="dictId"
    @done="reload"/>
</template>

<script>
import { mapGetters } from "vuex";
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import DictDataEdit from './dict-data-edit';

export default {
  name: 'DictData',
  components: {DictDataEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: {
    // 字典id
    dictId: Number
  },
  data() {
    return {
      // 表格数据接口
      url: '/system/dictdata/index',
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
        },
        {
          title: '字典项名称',
          dataIndex: 'name',
          align: 'center',
        },
        {
          title: '字典项值',
          dataIndex: 'code',
          align: 'center'
        },
        {
          title: '排序号',
          dataIndex: 'sort',
          sorter: true,
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          slots: {customRender: 'status'}
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
          width: 120,
          align: 'center',
          fixed: 'right',
          slots: {customRender: 'action'}
        }
      ],
      // 表格搜索条件
      where: {
        dictId: this.dictId
      },
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false
    };
  },
  methods: {
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload({});
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
    },
    /* 删除单个 */
    remove(row) {
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/system/dictdata/delete/' + [row.id]).then(res => {
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
        content: '确定要删除选中的字典项吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/system/dictdata/delete/' + this.selection.map(d => d.id)).then(res => {
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
    /* 修改状态 */
    editStatus(checked, row) {
      let params = Object.assign({}, {
        id : row.id,
        status : checked ? 1 : 2,
      });
      this.$http.put('/system/dictdata/status', params).then(res => {
        if (res.data.code === 0) {
          row.status = checked ? 1 : 2;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    }
  },
  watch: {
    // 监听字典id变化
    dictId() {
      this.where.dictId = this.dictId;
      this.reload();
    }
  }
}
</script>

<style scoped>
</style>
