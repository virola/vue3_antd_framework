<!-- 布局描述编辑弹窗 -->
<template>
  <a-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改布局描述':'添加布局描述'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 5}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 19}, sm: {span: 24}}">
      <a-form-item label="布局描述:" name="locDesc">
        <a-input
          v-model:value="form.locDesc"
          placeholder="请输入布局描述"
          allow-clear/>
      </a-form-item>
      <a-form-item label="布局位置:" name="locId">
        <a-input-number
          :min="0"
          class="ele-fluid"
          placeholder="请输入布局位置"
          v-model:value="form.locId"/>
      </a-form-item>
      <a-form-item
        label="所属站点:"
        name="itemId">
        <a-select
          v-model:value="form.itemId"
          placeholder="请选择所属站点"
          allow-clear>
          <a-select-option
            v-for="(item, index) in itemList"
            :key="index"
            :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
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
  name: 'LayoutDescEdit',
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
        locDesc: [
          {required: true, message: '请输入布局描述', type: 'string', trigger: 'blur'}
        ],
        locId: [
          {required: true, message: '请输入布局位置', type: 'number', trigger: 'blur'}
        ],
        itemId: [
          {required: true, message: '请选择所属站点', type: 'number', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', type: 'number', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 站点列表
      itemList: [],
    };
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
  mounted() {
    // 查询站点列表
    this.queryItemList();
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/layoutdesc/edit' : '/system/layoutdesc/add', this.form).then(res => {
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
    /* 查询站点列表 */
    queryItemList() {
      this.$http.get('/system/item/getItemList').then(res => {
        if (res.data.code === 0) {
          this.itemList = res.data.data;
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
