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
            <a-form-item label="职级名称:">
              <a-input
                v-model:value.trim="where.name"
                placeholder="请输入职级名称"
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
        v-model:selection="selection"
        :scroll="{x: 'max-content'}">
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="openEdit()" v-if="permission.includes('sys:link:add')">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="danger" @click="removeBatch" v-if="permission.includes('sys:link:dall')">
              <template #icon>
                <delete-outlined/>
              </template>
              <span>删除</span>
            </a-button>
          </a-space>
        </template>
        <!-- 友链类型 -->
        <template #type="{ record }">
          <a-tag :color="['green', 'orange'][record.type-1]">
            {{ ['友情链接', '合作伙伴'][record.type-1] }}
          </a-tag>
        </template>
        <!-- 使用平台 -->
        <template #platform="{ record }">
          <a-tag :color="['green', 'red', '', 'orange'][record.platform-1]">
            {{['PC站', 'WAP站', '微信小程序', 'APP应用'][record.platform-1] }}
          </a-tag>
        </template>
        <!-- 友链图片 -->
        <template #image="{ record }">
          <a-image :width="35" :src="record.image" />
        </template>
        <!-- 友链形式 -->
        <template #form="{ record }">
          <a-tag :color="['green', 'orange'][record.form-1]">
            {{['文字链接','图片链接'][record.form-1] }}
          </a-tag>
        </template>
        <!-- 友链状态 -->
        <template #status="{ text, record }">
          <a-switch
            :checked="text===1"
            @change="(checked) => editStatus(checked, record)"/>
        </template>
        <!-- 操作栏 -->
        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(record)" v-if="permission.includes('sys:link:edit')">修改</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除此职级吗？"
              @confirm="remove(record)">
              <a class="ele-text-danger" v-if="permission.includes('sys:link:delete')">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <link-edit
    v-model:visible="showEdit"
    :data="current"
    @done="reload"/>
</template>

<script>
import { mapGetters } from "vuex";
import {createVNode} from 'vue'
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import LinkEdit from './link-edit';

export default {
  name: 'SystemLink',
  components: {
    PlusOutlined,
    DeleteOutlined,
    LinkEdit
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/system/link/index',
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
        },
        {
          title: '友链名称',
          dataIndex: 'name',
          align: 'center'
        },
        {
          title: '友链类型',
          dataIndex: 'type',
          align: 'center',
          slots: {customRender: 'type'}
        },
        {
          title: '友链平台',
          dataIndex: 'platform',
          align: 'center',
          slots: {customRender: 'platform'}
        },
        {
          title: '友链地址',
          dataIndex: 'url',
          align: 'center',
        },
        {
          title: '友链图片',
          dataIndex: 'image',
          align: 'center',
          slots: {customRender: 'image'}
        },
        {
          title: '友链形式',
          dataIndex: 'form',
          align: 'center',
          slots: {customRender: 'form'}
        },
        {
          title: '状态',
          dataIndex: 'status',
          sorter: true,
          width: 90,
          align: 'center',
          slots: {customRender: 'status'}
        },
        {
          title: '排序',
          dataIndex: 'sort',
          sorter: true,
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
      showEdit: false
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
    /* 删除单个 */
    remove(row) {
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/system/link/delete/' + [row.id]).then(res => {
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
          this.$http.delete('/system/link/delete/' + this.selection.map(d => d.id)).then(res => {
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
    },
    /* 修改状态 */
    editStatus(checked, row) {
      let params = Object.assign({}, {
        id : row.id,
        status : checked ? 1 : 2,
      });
      this.$http.put('/system/link/status', params).then(res => {
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
