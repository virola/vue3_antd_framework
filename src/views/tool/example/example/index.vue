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
            <a-form-item label="案例名称:">
              <a-input
                v-model:value.trim="where.name"
                placeholder="请输入案例名称"
                allow-clear/>
            </a-form-item>
          </a-col>
          <!-- 类型下拉单选 -->
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="类型:">
              <a-select
                v-model:value="where.type"
                placeholder="请选择类型"
                allow-clear>
                <a-select-option :value="1">京东</a-select-option>
                <a-select-option :value="2">淘宝</a-select-option>
                <a-select-option :value="3">拼多多</a-select-option>
                <a-select-option :value="4">唯品会</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 是否VIP下拉单选 -->
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="是否VIP:">
              <a-select
                v-model:value="where.isVip"
                placeholder="请选择是否VIP"
                allow-clear>
                <a-select-option :value="1">是</a-select-option>
                <a-select-option :value="2">否</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <!-- 状态下拉单选 -->
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="状态:">
              <a-select
                v-model:value="where.status"
                placeholder="请选择状态"
                allow-clear>
                <a-select-option :value="1">正常</a-select-option>
                <a-select-option :value="2">停用</a-select-option>
              </a-select>
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
            <a-button type="primary" @click="openEdit()" v-if="permission.includes('sys:example:add')">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="danger" @click="removeBatch" v-if="permission.includes('sys:example:dall')">
              <template #icon>
                <delete-outlined/>
              </template>
              <span>删除</span>
            </a-button>
          </a-space>
        </template>
        <template #avatar="{ record }">
          <a-image :width="35" :src="record.avatar" />
        </template>

        <template #type="{ record }">
          <a-tag :color="['green', 'red', 'blue', 'orange', ''][record.type-1]">
            {{['京东','淘宝','拼多多','唯品会'][record.type-1] }}
          </a-tag>
        </template>
        <template #isVip="{ text, record }">
          <a-switch
            :checked="text===1"
            @change="(checked) => setIsVip(checked, record)"/>
        </template>

        <template #status="{ text, record }">
          <a-switch
            :checked="text===1"
            @change="(checked) => setStatus(checked, record)"/>
        </template>




        <template #action="{ record }">
          <a-space>
            <a @click="openEdit(record)" v-if="permission.includes('sys:example:edit')">修改</a>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="确定要删除此演示案例一吗？"
              @confirm="remove(record)">
              <a class="ele-text-danger" v-if="permission.includes('sys:example:delete')">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <example-edit
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
  import ExampleEdit from './example-edit';

  export default {
    name: 'SystemExample',
    components: {
      PlusOutlined,
      DeleteOutlined,
      ExampleEdit
    },
    computed: {
      ...mapGetters(["permission"]),
    },
    data() {
      return {
        // 表格数据接口
        url: '/system/example/index',
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
            title: '头像',
            dataIndex: 'avatar',
            align: 'center',
            width:100,
            slots: {customRender: 'avatar'}
          },
          {
            title: '案例名称',
            dataIndex: 'name',
            width:120,
            align: 'center'
          },
          {
            title: '类型',
            dataIndex: 'type',
            align: 'center',
            width:120,
            slots: {customRender: 'type'}
          },
          {
            title: '是否VIP',
            dataIndex: 'isVip',
            width:120,
            align: 'center',
            slots: {customRender: 'isVip'}
          },
          {
            title: '计划时间',
            dataIndex: 'planTime',
            width:180,
            align: 'center',
            customRender: ({text}) => this.$util.toDateString(text)
          },
          {
            title: '状态',
            dataIndex: 'status',
            width:120,
            align: 'center',
            slots: {customRender: 'status'}
          },
          {
            title: '显示顺序',
            dataIndex: 'sort',
            width:120,
            align: 'center'
          },
          {
            title: '备注',
            dataIndex: 'note',
            width:120,
            align: 'center'
          },
          {
            title: '添加时间',
            dataIndex: 'createTime',
            width:180,
            align: 'center',
            customRender: ({text}) => this.$util.toDateString(text)
          },
          {
            title: '更新时间',
            dataIndex: 'updateTime',
            width:180,
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
        this.$refs.table.reload({page: 1});
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
        this.$http.delete('/system/example/delete/' + [row.id]).then(res => {
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
          content: '确定要删除选中的演示案例一吗?',
          icon: createVNode(ExclamationCircleOutlined),
          maskClosable: true,
          onOk: () => {
            const hide = this.$message.loading('请求中..', 0);
            this.$http.delete('/system/example/delete', {
              data: this.selection.map(d => d.id)
            }).then(res => {
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
      setIsVip(checked, row) {
        let params = Object.assign({}, {
          id : row.id,
          isVip : checked ? 1 : 2,
        });
        this.$http.put('/system/example/setIsVip', params).then(res => {
          if (res.data.code === 0) {
            row.isVip = checked ? 1 : 2;
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.$message.error(e.message);
        });
      },
      /* 修改状态 */
      setStatus(checked, row) {
        let params = Object.assign({}, {
          id : row.id,
          status : checked ? 1 : 2,
        });
        this.$http.put('/system/example/setStatus', params).then(res => {
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
    }
  }
</script>

<style scoped>
</style>
