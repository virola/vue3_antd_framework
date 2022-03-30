<template>
  <div class="ele-body ele-body-card">
    <a-row :gutter="16">
      <a-col :lg="6" :md="10" :sm="24" :xs="24">
        <a-card
          :bordered="false"
          :body-style="{padding: '24px 16px'}">
          <!-- 表格 -->
          <ele-pro-table
            ref="table"
            row-key="id"
            :datasource="url"
            :columns="columns"
            v-model:current="current"
            :need-page="true"
            :row-selection="{columnWidth: 38}"
            :toolkit="[]"
            @done="done">
            <template #toolbar>
              <a-space size="middle">
                <a-button
                  type="primary"
                  @click="openEdit()"
                  v-if="permission.includes('sys:dictionary:add')">新建
                </a-button>
                <a-button
                  type="primary"
                  @click="openEdit(current)"
                  :disabled="!current"
                  v-if="permission.includes('sys:dictionary:edit')">修改
                </a-button>
                <a-button
                  type="danger"
                  @click="remove"
                  :disabled="!current"
                  v-if="permission.includes('sys:dictionary:delete')">删除
                </a-button>
              </a-space>
            </template>
          </ele-pro-table>
        </a-card>
      </a-col>
      <a-col :lg="18" :md="14" :sm="24" :xs="24">
        <a-card :bordered="false">
          <dict-data
            v-if="current"
            :dict-id="current.id"/>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <!-- 编辑弹窗 -->
  <dict-edit
    v-model:visible="showEdit"
    :data="editData"
    @done="reload"/>
</template>

<script>
import { mapGetters } from "vuex";
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import DictData from './dict-data';
import DictEdit from './dict-edit';

export default {
  name: 'Dictionary',
  components: {DictData, DictEdit},
  computed: {
    ...mapGetters(["permission"]),
  },
  data() {
    return {
      // 表格数据接口
      url: '/system/dict/index',
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
        },
        {
          title: '字典名称',
          dataIndex: 'name',
          align: 'center',
        }
      ],
      // 表格选中数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 编辑回显数据
      editData: null
    };
  },
  methods: {
    /* 表格渲染完成回调 */
    done(res) {
      if (res.data.records.length > 0) {
        this.current = res.data.records[0];
      }
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload();
    },
    /* 打开编辑弹窗 */
    openEdit(row) {
      this.editData = row;
      this.showEdit = true;
    },
    /* 删除 */
    remove() {
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的字典吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.delete('/system/dict/delete/' + [this.current.id]).then(res => {
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
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 768px) {
  .ant-card {
    min-height: calc(100vh - 122px);
  }
}
</style>
