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
    :scroll="{x: 1000}">
    <template #status="{ text, record }">
      <a-switch
        :checked="text===1"
        @change="(checked) => editStatus(checked, record)"/>
    </template>
    <template #toolbar>
      <a-row :gutter="16">
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-input
            v-model:value.trim="where.title"
            placeholder="请输入配置项标题"
            allow-clear/>
        </a-col>
        <a-col :lg="6" :md="8" :sm="24" :xs="24">
          <a-space size="middle">
            <a-button type="primary" @click="reload">查询</a-button>
            <a-button type="primary" @click="openEdit()" v-if="permission.includes('sys:config:add')">新建</a-button>
            <a-button type="danger" @click="removeBatch" v-if="permission.includes('sys:config:dall')">删除</a-button>
          </a-space>
        </a-col>
      </a-row>
    </template>
    <!-- 配置图片 -->
    <template #value="{ record }">
      <!-- 单图 -->
      <a-image v-if="record.type=='image'" :width="35" :src="record.value" />
      <!-- 多图 -->
      <span v-else-if="record.type=='images'" v-for="(item, index) in record.valueList" :key="index" style="padding:2px;">
        <a-image :width="35" :src="item" />
      </span>
      <!-- 其他 -->
      <span v-else> {{record.value}} </span>
    </template>
    <!-- 配置类型 -->
    <template #type="{ record }">
      <a-tag v-if="record.type === 'readonly'" color="blue">只读文本</a-tag>
      <a-tag v-if="record.type === 'number'" color="green">数字</a-tag>
      <a-tag v-if="record.type === 'text'" color="orange">单行文本</a-tag>
      <a-tag v-if="record.type === 'textarea'" color="green">多行文本</a-tag>
      <a-tag v-if="record.type === 'array'" color="blue">数组</a-tag>
      <a-tag v-if="record.type === 'password'" color="green">密码</a-tag>
      <a-tag v-if="record.type === 'radio'" color="orange">单选框</a-tag>
      <a-tag v-if="record.type === 'checkbox'" color="green">复选框</a-tag>
      <a-tag v-if="record.type === 'select'" color="orange">下拉框</a-tag>
      <a-tag v-if="record.type === 'icon'" color="green">字体图标</a-tag>
      <a-tag v-if="record.type === 'date'" color="orange">日期</a-tag>
      <a-tag v-if="record.type === 'datetime'" color="green">时间</a-tag>
      <a-tag v-if="record.type === 'image'" color="orange">单张图片</a-tag>
      <a-tag v-if="record.type === 'images'" color="green">多张图片</a-tag>
      <a-tag v-if="record.type === 'file'" color="orange">单个文件</a-tag>
      <a-tag v-if="record.type === 'files'" color="green">多个文件</a-tag>
      <a-tag v-if="record.type === 'ueditor'" color="blue">富文本编辑器</a-tag>
    </template>
    <!-- 操作栏 -->
    <template #action="{ record }">
      <a-space>
        <a @click="openEdit(record)" v-if="permission.includes('sys:config:edit')">修改</a>
        <a-divider type="vertical"/>
        <a-popconfirm
          title="确定要删除此配置项吗？"
          @confirm="remove(record)">
          <a class="ele-text-danger" v-if="permission.includes('sys:config:delete')">删除</a>
        </a-popconfirm>
      </a-space>
    </template>
  </ele-pro-table>
  <!-- 编辑弹窗 -->
  <config-data-edit
    v-model:visible="showEdit"
    :data="current"
    :config-id="configId"
    @done="reload"/>
</template>

<script>
import { mapGetters } from "vuex";
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import ConfigDataEdit from './config-data-edit';

export default {
  name: 'ConfigData',
  components: {ConfigDataEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  props: {
    // 配置id
    configId: Number
  },
  data() {
    return {
      // 表格数据接口
      url: '/system/configdata/index',
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
        },
        {
          title: '配置项标题',
          dataIndex: 'title',
          align: 'center',
          width: 100,
        },
        {
          title: '配置编码',
          dataIndex: 'code',
          align: 'center',
          width: 100,
        },
        {
          title: '配置项值',
          dataIndex: 'value',
          align: 'center',
          width: 300,
          // 设置行高不变内容多了加...
          ellipsis: true,
          slots: {customRender: 'value'}
        },
        {
          title: '类型',
          dataIndex: 'type',
          align: 'center',
          width: 100,
          slots: {customRender: 'type'}
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          width: 100,
          slots: {customRender: 'status'}
        },
        {
          title: '排序号',
          dataIndex: 'sort',
          sorter: true,
          width: 100,
          align: 'center'
        },
        {
          title: '备注',
          dataIndex: 'note',
          width: 200,
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          align: 'center',
          width: 150,
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
        configId: this.configId
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
      this.$http.delete('/system/configdata/delete/' + [row.id]).then(res => {
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
        content: '确定要删除选中的配置项吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/system/configdata/delete/' + this.selection.map(d => d.id)).then(res => {
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
      this.$http.put('/system/configdata/status', params).then(res => {
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
    // 监听配置id变化
    configId() {
      this.where.configId = this.configId;
      this.reload();
    }
  }
}
</script>

<style scoped>
</style>
