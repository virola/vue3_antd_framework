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
            <a-form-item label="用户账号:">
              <a-input
                v-model:value.trim="where.username"
                placeholder="请输入用户账号"
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
            <a-button type="primary" @click="openEdit()">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="primary" danger @click="removeBatch">
              <template #icon>
                <delete-outlined/>
              </template>
              <span>删除</span>
            </a-button>
          </a-space>
        </template>
        <!-- 用户名 -->
        <template #realname="{ record }">
          <router-link :to="'/system/user/info?id=' + record.id">
            {{ record.realname }}
          </router-link>
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
        <!-- 角色 -->
        <template #roles="{ record }">
          <a-tag
            v-for="(item, index) in record.roles"
            :key="index"
            color="blue">
            {{ item.name }}
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
            <a @click="openEdit(record)" v-if="permission.includes('sys:user:edit')">修改</a>
            <a-divider type="vertical"/>
            <a @click="resetPsw(record)" v-if="permission.includes('sys:user:resetPwd')">重置密码</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除此用户吗？"
              @confirm="remove(record)">
              <a class="ele-text-danger" v-if="permission.includes('sys:user:delete')">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <user-edit
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
import UserEdit from './user-edit';
import { mapGetters } from "vuex";

export default {
  name: 'SystemUser',
  components: {
    PlusOutlined,
    DeleteOutlined,
    UserEdit
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/system/user/index',
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
        },
        {
          title: '用户账号',
          dataIndex: 'username',
          align: 'center',
        },
        {
          title: '用户姓名',
          dataIndex: 'realname',
          align: 'center',
          slots: {customRender: 'realname'}
        },
        {
          title: '头像',
          dataIndex: 'avatar',
          align: 'center',
          slots: {customRender: 'avatar'}
        },
        {
          title: '性别',
          dataIndex: 'genderName',
          align: 'center',
          slots: {customRender: 'gender'}
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          align: 'center'
        },
        {
          title: '职级名称',
          dataIndex: 'levelName',
          align: 'center'
        },
        {
          title: '岗位名称',
          dataIndex: 'positionName',
          align: 'center'
        },
        {
          title: '角色',
          key: 'roles',
          align: 'left',
          slots: {customRender: 'roles'}
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
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
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
      this.$http.delete('/system/user/delete/' + [row.id]).then(res => {
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
        content: '确定要删除选中的用户吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/system/user/delete/' + this.selection.map(d => d.id)).then(res => {
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
    /* 重置用户密码 */
    resetPsw(row) {
      this.$confirm({
        title: '提示',
        content: '确定要重置此用户的密码为"123456"吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          // const formData = new FormData();
          // formData.append('id', row.id);
          // formData.append('password', '123456');
          this.$http.put('/system/user/resetPwd', {
            id : row.id,
            password: '123456'
          }).then(res => {
            hide();
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
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
    /* 修改用户状态 */
    editStatus(checked, row) {
      // let params = new FormData();
      // params.append('id', row.id);
      // params.append('status', checked ? 1 : 2);
      let params = Object.assign({}, {
        id : row.id,
        status : checked ? 1 : 2,
      });
      this.$http.put('/system/user/status', params).then(res => {
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
