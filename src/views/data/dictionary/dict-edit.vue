<!-- 字典编辑弹窗 -->
<template>
  <a-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改字典':'添加字典'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span:7}, sm: {span: 24}}"
      :wrapper-col="{md: {span:17}, sm: {span: 24}}">
      <a-form-item label="字典名称:" name="name">
        <a-input
          v-model:value="form.name"
          placeholder="请输入字典名称"
          allow-clear/>
      </a-form-item>
      <a-form-item label="字典值:" name="code">
        <a-input
          v-model:value="form.code"
          placeholder="请输入字典值"
          allow-clear/>
      </a-form-item>
      <a-form-item label="排序号:" name="sort">
        <a-input-number
          v-model:value="form.sort"
          placeholder="请输入排序号"
          :min="0"
          class="ele-fluid"/>
      </a-form-item>
      <a-form-item label="备注:">
        <a-textarea
          v-model:value="form.note"
          placeholder="请输入备注"
          :rows="4"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'DictEdit',
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
          {required: true, message: '请输入字典名称', type: 'string', trigger: 'blur'}
        ],
        code: [
          {required: true, message: '请输入字典值', type: 'string', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', type: 'number', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
    }
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/dict/edit' : '/system/dict/add', this.form).then(res => {
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
    }
  }
}
</script>

<style scoped>
</style>
