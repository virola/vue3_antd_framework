<!-- 编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改栏目':'添加栏目'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 6}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 17}, sm: {span: 24}}">
      <a-form-item 
        label="栏目封面:"
        :label-col="{sm: {span: 3}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
        <uploadImage :limit="10" :updDir="updDir" v-model:value="form.cover"/>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="栏目名称" name="name">
            <a-input
              allow-clear
              placeholder="请输入栏目名称"
              v-model:value="form.name"/>
          </a-form-item>
          <a-form-item label="拼音全拼" name="name">
            <a-input
              allow-clear
              placeholder="请输入拼音全拼"
              v-model:value="form.name"/>
          </a-form-item>
          <a-form-item label="排序号:" name="sort">
            <a-input-number
              :min="0"
              class="ele-fluid"
              placeholder="请输入排序号"
              v-model:value="form.sort"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item label="上级栏目" name="pid">
            <a-tree-select
              allow-clear
              :tree-data="cateList"
              tree-default-expand-all
              placeholder="请选择上级栏目"
              v-model:value="form.pid"
              :dropdown-style="{maxHeight: '360px', overflow: 'auto'}"/>
          </a-form-item>
          <a-form-item label="拼音简拼" name="code">
            <a-input
              allow-clear
              placeholder="请输入拼音简拼"
              v-model:value="form.code"/>
          </a-form-item>
          <a-form-item label="栏目状态：" name="status">
            <a-radio-group
              v-model:value="form.status">
              <a-radio :value="1">正常</a-radio>
              <a-radio :value="2">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="备注:"
        :label-col="{sm: {span: 3}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
        <a-textarea
          v-model:value="form.note"
          placeholder="请输入备注"
          :rows="4"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import uploadImage from '@/components/uploadImage'
export default {
  name: 'ItemcateEdit',
  components: {uploadImage},
  emits: [
    'done',
    'update:visible'
  ],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部栏目数据
    cateList: Array
  },
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, type: 'string', message: '请输入栏目名称', trigger: 'blur'}
        ],
        sort: [
          {required: true, type: 'number', message: '请输入排序号', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 图片上传目录
      updDir: 'itemcate',
    };
  },
  watch: {
    data() {
      this.isUpdate = !!(this.data && this.data.id);
      this.form = this.initFormData(this.data);
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
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/itemcate/edit' : '/system/itemcate/add',
          Object.assign({}, this.form, {
            pid: this.form.pid || 0,
          })
        ).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
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
    /* 初始化form数据 */
    initFormData(data) {
      let form = {
        status: 1,
        sort: 125,
      };
      if (data) {
        Object.assign(form, data, {
          pid: data.pid === 0 ? null : data.pid,
        });
      }
      return form;
    }
  }
}
</script>

<style scoped>
</style>
