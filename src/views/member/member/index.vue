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
            <a-form-item label="会员账号:">
              <a-input
                v-model:value.trim="where.username"
                placeholder="请输入会员账号"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="性别:">
              <a-select
                v-model:value="where.gender"
                placeholder="请选择性别"
                allow-clear>
                <a-select-option :value="1">男</a-select-option>
                <a-select-option :value="2">女</a-select-option>
                <a-select-option :value="3">保密</a-select-option>
              </a-select>
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
            <a-button type="primary" @click="openEdit()" v-if="permission.includes('sys:member:add')">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="primary" danger @click="removeBatch" v-if="permission.includes('sys:member:dall')">
              <template #icon>
                <delete-outlined/>
              </template>
              <span>删除</span>
            </a-button>
          </a-space>
        </template>
        <!-- 性别 -->
        <template #gender="{ record }">
          <a-tag :color="['green', 'orange', 'red'][record.gender-1]">
            {{ ['男', '女', '未知'][record.gender-1] }}
          </a-tag>
        </template>
        <!-- 头像 -->
        <template #avatar="{ record }">
          <a-image :width="35" :src="record.avatar" />
        </template>
        <!-- 设备来源 -->
        <template #device="{ record }">
          <a-tag :color="['green', 'red', '', 'orange', 'green'][record.device-1]">
            {{['苹果', '安卓', 'WAP站', 'PC站', '后台'][record.device-1] }}
          </a-tag>
        </template>
        <!-- 注册来源 -->
        <template #source="{ record }">
          <a-tag :color="['green', 'red', '', 'orange', 'green'][record.source-1]">
            {{['APP注册', '小程序注册', '网站注册', 'WAP站注册', '马甲会员'][record.source-1] }}
          </a-tag>
        </template>
        <!-- 状态 -->
        <template #status="{ text, record }">
          <a-switch
            :checked="text===1"
            @change="(checked) => editStatus(checked, record)"/>
        </template>
        <!-- 操作栏 -->
        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(record)" v-if="permission.includes('sys:member:edit')">修改</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除此会员吗？"
              @confirm="remove(record)">
              <a class="ele-text-danger" v-if="permission.includes('sys:member:delete')">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <member-edit
    v-model:visible="showEdit"
    :data="current"
    @done="reload"/>
</template>

<script>
import {createVNode} from 'vue';
import {
  PlusOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import MemberEdit from './member-edit';
import { mapGetters } from "vuex";

export default {
  name: 'Member',
  components: {
    PlusOutlined,
    DeleteOutlined,
    MemberEdit
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/member/member/index',
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
        },
         {
          title: '会员账号',
          dataIndex: 'username',
          align: 'center'
        },
        {
          title: '会员姓名',
          dataIndex: 'realname',
          align: 'center'
        },
        {
          title: '会员昵称',
          dataIndex: 'nickname',
          align: 'center'
        },
        {
          title: '性别',
          dataIndex: 'gender',
          align: 'center',
          slots: {customRender: 'gender'}
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          align: 'center',
          slots: {customRender: 'avatar'}
        },
        {
          title: '设备来源',
          dataIndex: 'device',
          align: 'center',
          slots: {customRender: 'device'}
        },
        {
          title: '注册来源',
          dataIndex: 'source',
          align: 'center',
          slots: {customRender: 'source'}
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
          title: '注册时间',
          dataIndex: 'createTime',
          sorter: true,
          align: 'center',
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          align: 'center',
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
      this.$http.delete('/member/member/delete/' + [row.id]).then(res => {
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
        content: '确定要删除选中的会员吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/member/member/delete/' + this.selection.map(d => d.id)).then(res => {
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
    /* 修改会员状态 */
    editStatus(checked, row) {
      let params = Object.assign({}, {
        id : row.id,
        status : checked ? 1 : 2,
      });
      this.$http.put('/member/member/status', params).then(res => {
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
