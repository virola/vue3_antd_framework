<!-- 站点编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改站点':'添加站点'"
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
        label="站点图片:"
        :label-col="{sm: {span: 3}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
        <uploadImage :limit="10" :updDir="updDir" v-model:value="form.image"/>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item
            label="站点名称："
            name="name">
            <a-input
              v-model:value="form.name"
              placeholder="请输入站点名称"
              allow-clear/>
          </a-form-item>
          <a-form-item
            label="站点URL："
            name="url">
            <a-input
              v-model:value="form.url"
              placeholder="请输入站点URL"
              allow-clear/>
          </a-form-item>
          <a-form-item label="排序号：" name="sort">
            <a-input-number
              :min="0"
              class="ele-fluid"
              placeholder="请输入排序号"
              v-model:value="form.sort"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item
            label="站点类型："
            name="type">
            <a-select
              v-model:value="form.type"
              placeholder="请选择站点类型"
              allow-clear>
              <a-select-option :value="1">普通站点</a-select-option>
              <a-select-option :value="2">其他站点</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="站点域名" name="isDomain">
            <a-radio-group
              v-model:value="form.isDomain">
              <a-radio :value="1">一级域名</a-radio>
              <a-radio :value="2">二级域名</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="站点状态：" name="status">
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
  name: 'ItemEdit',
  components: {uploadImage},
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
          {required: true, message: '请输入站点名称', type: 'string', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', type: 'number', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 图片上传目录
      updDir: 'item',
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {type:1, isDomain:1, status:1};
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
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/item/edit' : '/system/item/add', this.form).then(res => {
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
