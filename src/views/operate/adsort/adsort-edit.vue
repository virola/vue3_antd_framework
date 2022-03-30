<!-- 广告位编辑弹窗 -->
<template>
  <a-modal
    :width="480"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改广告位':'添加广告位'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 5}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 19}, sm: {span: 24}}">
      <a-form-item label="广告位名称:" name="name">
        <a-input
          v-model:value="form.name"
          placeholder="请输入广告位名称"
          allow-clear/>
      </a-form-item>
      <a-form-item label="广告位描述:" name="description">
        <a-input
          v-model:value="form.description"
          placeholder="请输入广告位描述"
          allow-clear/>
      </a-form-item>
      <a-form-item label="广告位位置:" name="locId">
        <a-input-number
          :min="0"
          class="ele-fluid"
          placeholder="请输入广告位位置"
          v-model:value="form.locId"/>
      </a-form-item>
      <a-form-item
        label="投放位置:"
        name="platform">
        <a-select
          v-model:value="form.platform"
          placeholder="请选择投放位置"
          allow-clear>
          <a-select-option :value="1">PC站</a-select-option>
          <a-select-option :value="2">WAP站</a-select-option>
          <a-select-option :value="3">微信小程序</a-select-option>
          <a-select-option :value="4">APP应用</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属栏目:" name="cateId">
        <a-tree-select
          allow-clear
          :tree-data="cateList"
          tree-default-expand-all
          placeholder="请选择所属栏目"
          v-model:value="form.cateId"
          :dropdown-style="{maxHeight: '360px', overflow: 'auto'}"/>
      </a-form-item>
      <a-form-item label="排序号:" name="sort">
        <a-input-number
          :min="0"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sort"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'AdsortEdit',
  emits: [
    'done',
    'update:visible'
  ],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, message: '请输入广告位名称', type: 'string', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入广告位描述', type: 'string', trigger: 'blur'}
        ],
        locId: [
          {required: true, message: '请输入广告位位置', type: 'number', trigger: 'blur'}
        ],
        platform: [
          {required: true, message: '请选择投放平台', type: 'number', trigger: 'blur'}
        ],
        cateId: [
          {required: true, message: '请选择所属栏目', type: 'number', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', type: 'number', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 栏目列表
      cateList: []
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {status:1};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  mounted() {
    // 查询栏目列表
    this.queryCateList();
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/adsort/edit' : '/system/adsort/add', this.form).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            if (!this.isUpdate) {
              this.form = {};
            }
            this.updateVisible(false);
            this.$emit('done');
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(e => {
          this.loading = false;
          this.$message.error(e.message);
        });
      }).catch(() => {
      });
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /* 查询栏目列表 */
    queryCateList() {
      this.$http.get('/system/itemcate/getCateList').then(res => {
        if (res.data.code === 0) {
          this.cateList = this.$util.toTreeData(res.data.data.map(d => {
            d.key = d.id;
            d.value = d.id;
            d.title = d.name;
            return d;
          }), 'id', 'pid');
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
