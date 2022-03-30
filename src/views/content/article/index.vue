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
            <a-form-item label="文章标题:">
              <a-input
                v-model:value.trim="where.title"
                placeholder="请输入文章标题"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item style="padding-left:10px;" class="ele-text-left" :wrapper-col="{span: 24}">
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
        v-model:selection="selection"
        :scroll="{x: 'max-content'}">
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="openEdit()" v-if="permission.includes('sys:article:add')">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="primary" danger @click="removeBatch" v-if="permission.includes('sys:article:dall')">
              <template #icon>
                <delete-outlined/>
              </template>
              <span>删除</span>
            </a-button>
          </a-space>
        </template>
        <!-- 文章封面 -->
        <template #cover="{ record }">
          <a-image :width="35" :src="record.cover" />
        </template>
        <!-- 设置状态 -->
        <template #status="{ text, record }">
          <a-switch
            :checked="text===1"
            @change="(checked) => editStatus(checked, record)"/>
        </template>
        <!-- 操作栏 -->
        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(record)" v-if="permission.includes('sys:article:edit')">修改</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除此文章吗？"
              @confirm="remove(record)">
              <a class="ele-text-danger" v-if="permission.includes('sys:article:delete')">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <a-drawer
    title="文章编辑"
    :width="'calc(100vw - 215px)'"
    :placement="placement"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose">
    <!-- 编辑窗口 -->
    <article-edit
      :data="current"
      :cate-list="cateList"
      @close="onClose"/>
  </a-drawer>
</template>

<script>
import {createVNode} from 'vue'
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import ArticleEdit from './article-edit';
import { mapGetters } from "vuex";

export default {
  name: 'CtxArticle',
  components: {
    PlusOutlined,
    DeleteOutlined,
    ArticleEdit,
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/system/article/index',
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
        },
        {
          title: '文章标题',
          dataIndex: 'title',
          align: 'center'
        },
        {
          title: '文章封面',
          dataIndex: 'cover',
          align: 'center',
          slots: {customRender: 'cover'}
        },
        {
          title: '所属栏目',
          dataIndex: 'cateName',
          align: 'center'
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          width: 100,
          slots: {customRender: 'status'}
        },
        {
          title: '排序',
          dataIndex: 'sort',
          width: 100,
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
      // 是否显示编辑弹窗
      showEdit: false,
      visible: false,
      // 抽屉查出方式
      placement: 'right',
      // 栏目列表
      cateList: [],
    };
  },
  methods: {
    /* 搜索 */
    reload() {
      this.selection = [];
      this.$refs.table.reload({where: this.where});
    },
    /*  重置搜索 */
    reset() {
      this.where = {};
      this.reload();
    },
    /* 删除单个 */
    remove(row) {
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/system/article/delete/' + [row.id]).then(res => {
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
        content: '确定要删除选中的文章吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/system/article/delete/' + this.selection.map(d => d.id)).then(res => {
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
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.current = row;
      this.showEdit = true;
      this.showDrawer();
    },
    /* 修改状态 */
    editStatus(checked, row) {
      let params = Object.assign({}, {
        id : row.id,
        status : checked ? 1 : 2,
      });
      this.$http.put('/system/article/status', params).then(res => {
        if (res.data.code === 0) {
          row.status = checked ? 1 : 2;
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /* 查询栏目列表 */
    getCateList() {
      this.$http.get('/system/itemcate/getCateList').then(res => {
        if (res.data.code === 0) {
          this.cateList = this.$util.toTreeData(res.data.data, 'id', 'pid');
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
      // 关闭后刷新列表页
      this.reload();
    },
    onChange(e) {
      this.placement = e.target.value;
    }
  }
}
</script>

<style scoped>
</style>
