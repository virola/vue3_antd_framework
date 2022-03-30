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
            <a-form-item label="栏目名称:">
              <a-input
                v-model:value.trim="where.name"
                placeholder="请输入栏目名称"
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
        row-key="id"
        :datasource="url"
        :columns="columns"
        :where="where"
        :need-page="false"
        :parse-data="parseData"
        :expand-icon-column-index="1"
        :expanded-row-keys="expandedRowKeys"
        :scroll="{x: 'max-content'}"
        @expandedRowsChange="onExpandedRowsChange">
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="openEdit()" v-if="permission.includes('sys:itemcate:add')">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button @click="expandAll" v-if="permission.includes('sys:itemcate:expand')">展开全部</a-button>
            <a-button @click="foldAll" v-if="permission.includes('sys:itemcate:collapse')">折叠全部</a-button>
          </a-space>
        </template>
        <!-- 栏目封面 -->
        <template #cover="{ record }">
          <a-image :width="35" :src="record.cover" />
        </template>
        <!-- 栏目状态 -->
        <template #status="{ record }">
          <a-tag :color="['green', 'orange'][record.status-1]">
            {{ ['正常', '停用'][record.status-1] }}
          </a-tag>
        </template>
        <!-- 操作栏 -->
        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(null, record.id)" v-if="permission.includes('sys:itemcate:addz')">添加</a>
            <a-divider type="vertical"/>
            <a @click="openEdit(record)" v-if="permission.includes('sys:itemcate:edit')">修改</a>
            <a-divider type="vertical"/>
            <a-popconfirm @confirm="remove(record)" title="确定要删除此栏目吗？">
              <a class="ele-text-danger" v-if="permission.includes('sys:itemcate:delete')">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <itemcate-edit
    v-model:visible="showEdit"
    :data="current"
    :cate-list="cateList"
    @done="reload"/>
</template>

<script>
import { mapGetters } from "vuex";
import {PlusOutlined} from '@ant-design/icons-vue';
import ItemcateEdit from './itemcate-edit';

export default {
  name: 'SystemItemCate',
  components: {PlusOutlined, ItemcateEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/system/itemcate/index',
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
        },
        {
          title: '栏目名称',
          dataIndex: 'name',
          align: 'center',
          width: 200
        },
        {
          title: '拼音(全拼)',
          dataIndex: 'pinyin',
          align: 'center'
        },
        {
          title: '拼音(简拼)',
          dataIndex: 'code',
          align: 'center'
        },
        {
          title: '栏目封面',
          dataIndex: 'cover',
          align: 'center',
          slots: {customRender: 'cover'}
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          align: 'center',
          slots: {customRender: 'status'}
        },
        {
          title: '排序',
          dataIndex: 'sort',
          align: 'center',
          sorter: true
        },
        {
          title: '备注',
          dataIndex: 'note',
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
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 表格展开的行
      expandedRowKeys: [],
      // 全部栏目数据
      cateList: []
    };
  },
  methods: {
    /* 解析接口返回数据 */
    parseData(res) {
      res.data = this.$util.toTreeData(res.data.map(d => {
        d.key = d.id;
        d.value = d.id;
        d.title = d.name;
        return d;
      }), 'id', 'pid');
      if (!Object.keys(this.where).length) {
        this.cateList = res.data;
      }
      if (!this.expandedRowKeys.length) {
        this.expandAll();
      }
      // return res;
      return {
        code : res.code,
        msg : res.msg,
        data : {
          records : res.data
        }
      };
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload();
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },
    /* 打开编辑弹窗 */
    openEdit(row, pid) {
      this.current = Object.assign({
        pid: pid
      }, row);
      this.showEdit = true;
    },
    /* 删除单个 */
    remove(row) {
      if (row.children && row.children.length > 0) {
        this.$message.error('请先删除子节点');
        return;
      }
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/system/itemcate/delete/' + [row.id]).then(res => {
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
    /* 展开全部 */
    expandAll() {
      let keys = [];
      this.$util.eachTreeData(this.cateList, (d) => {
        if (d.children && d.children.length) {
          keys.push(d.id);
        }
      });
      this.expandedRowKeys = keys;
    },
    /* 折叠全部 */
    foldAll() {
      this.expandedRowKeys = [];
    },
    /* 展开的行变化 */
    onExpandedRowsChange(expandedRows) {
      this.expandedRowKeys = expandedRows;
    },
    /* 修改状态 */
    editStatus(checked, row) {
      let params = Object.assign({}, {
        id : row.id,
        status : checked ? 1 : 2,
      });
      this.$http.put('/system/itemcate/status', params).then(res => {
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
  }
}
</script>

<style scoped>
</style>
