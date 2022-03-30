<!-- 编辑弹窗 -->
<template>
  <a-modal
    :width="450"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改城市':'新建城市'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 7}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 17}, sm: {span: 24}}">
      <a-form-item label="城市名称:" name="name">
        <a-input
          allow-clear
          placeholder="请输入城市名称"
          v-model:value="form.name"/>
      </a-form-item>
      <a-form-item label="城市等级:" name="level">
        <a-radio-group
          v-model:value="form.level">
          <a-radio :value="1">省份</a-radio>
          <a-radio :value="2">城市</a-radio>
          <a-radio :value="3">县区</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="城市编码:" name="citycode">
        <a-input
          allow-clear
          placeholder="请输入城市编码"
          v-model:value="form.citycode"/>
      </a-form-item>
      <a-form-item label="地里编码:" name="adcode">
        <a-input
          allow-clear
          placeholder="请输入地里编码"
          v-model:value="form.adcode"/>
      </a-form-item>
      <a-form-item label="经度:" name="lng">
        <a-input
          allow-clear
          placeholder="请输入经度"
          v-model:value="form.lng"/>
      </a-form-item>
      <a-form-item label="纬度:" name="lat">
        <a-input
          allow-clear
          placeholder="请输入纬度"
          v-model:value="form.lat"/>
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
  name: 'CityEdit',
  components: {},
  emits: [
    'done',
    'update:visible'
  ],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object,
    // 全部城市数据
    cityList: Array
  },
  data() {
    return {
      // 表单数据
      form: this.initFormData(this.data),
      // 表单验证规则
      rules: {
        name: [
          {required: true, type: 'string', message: '请输入城市名称', trigger: 'blur'}
        ],
        citycode: [
          {required: true, type: 'string', message: '请输入城市编码', trigger: 'blur'}
        ],
        sort: [
          {required: true, type: 'number', message: '请输入排序号', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false
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
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/city/edit' : '/system/city/add',
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
        level:1,
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
