<template>
  <div class="ele-body ele-body-card">
    <a-row :gutter="16">
      <a-col :lg="6" :md="24" :sm="24" :xs="24">
        <a-card
          :bordered="false"
          :body-style="{padding: '24px 16px'}">
          <div class="ele-table-tool">
            <a-space size="middle">
              <a-button
                type="primary"
                @click="openEdit()">新建
              </a-button>
              <a-button
                type="primary"
                @click="openEdit(current)"
                :disabled="!current">修改
              </a-button>
              <a-button
                danger
                type="primary"
                @click="remove"
                :disabled="!current">删除
              </a-button>
            </a-space>
          </div>
          <a-tree
            :tree-data="data"
            v-model:expanded-keys="expandedRowKeys"
            v-model:selected-keys="selectedRowKeys"
            @select="onTreeSelect"/>
        </a-card>
      </a-col>
      <a-col :lg="18" :md="24" :sm="24" :xs="24">
        <a-card :bordered="false">
          <org-user-list
            v-if="current"
            :organization-id="current.organizationId"
            :organization-list="data"/>
        </a-card>
      </a-col>
    </a-row>
  </div>
  <!-- 编辑弹窗 -->
  <org-edit
    v-model:visible="showEdit"
    :data="editData"
    :organization-list="data"
    @done="query"/>
</template>

<script>
import {createVNode} from 'vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import OrgUserList from './org-user-list';
import OrgEdit from './org-edit';

export default {
  name: 'SystemOrganization',
  components: {
    OrgUserList,
    OrgEdit
  },
  data() {
    return {
      // 加载状态
      loading: true,
      // 树形数据
      data: [],
      // 树展开的key
      expandedRowKeys: [],
      // 树选中的key
      selectedRowKeys: [],
      // 选中数据
      current: null,
      // 是否显示表单弹窗
      showEdit: false,
      // 编辑回显数据
      editData: null
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    /* 查询 */
    query() {
      this.loading = true;
      this.$http.get('/sys/organization').then(res => {
        this.loading = false;
        if (res.data.code === 0) {
          let eks = [];
          res.data.data.forEach(d => {
            d.key = d.organizationId;
            d.value = d.organizationId;
            d.title = d.organizationName;
            eks.push(d.key);
          });
          this.expandedRowKeys = eks;
          this.data = this.$util.toTreeData(res.data.data, 'organizationId', 'parentId');
          if (this.data.length) {
            this.selectedRowKeys = [this.data[0].key];
            this.onTreeSelect();
          } else {
            this.selectedRowKeys = [];
            this.current = null;
          }
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.loading = false;
        this.$message.error(e.message);
      });
    },
    /* 选择数据 */
    onTreeSelect() {
      this.$util.eachTreeData(this.data, (d) => {
        if (this.selectedRowKeys.indexOf(d.key) !== -1) {
          this.current = d;
          return false;
        }
      });
    },
    /* 打开编辑弹窗 */
    openEdit(item) {
      this.editData = Object.assign({}, {
        parentId: this.current.parentId
      }, item);
      this.showEdit = true;
    },
    /* 删除 */
    remove() {
      this.$confirm({
        title: '提示',
        content: '确定要删除选中的机构吗?',
        icon: createVNode(ExclamationCircleOutlined),
        maskClosable: true,
        onOk: () => {
          const hide = this.$message.loading('请求中..', 0);
          this.$http.post('/sys/organization/' + this.current.organizationId).then(res => {
            hide();
            if (res.data.code === 0) {
              this.$message.success(res.data.msg);
              this.query();
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
