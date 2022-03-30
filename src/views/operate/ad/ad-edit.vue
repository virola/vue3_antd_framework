<!-- 广告编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改广告':'添加广告'"
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
        label="广告图片:"
        :label-col="{sm: {span: 3}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
        <uploadImage :limit="10" :updDir="updDir" v-model:value="form.cover"/>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item
            label="广告标题:"
            name="title">
            <a-input
              v-model:value="form.title"
              placeholder="请输入广告标题"
              allow-clear/>
          </a-form-item>
          <a-form-item
            label="广告类型:"
            name="type">
            <a-select
              v-model:value="form.type"
              placeholder="请选择广告类型"
              allow-clear>
              <a-select-option :value="1">图片</a-select-option>
              <a-select-option :value="2">文字</a-select-option>
              <a-select-option :value="3">视频</a-select-option>
              <a-select-option :value="4">其他</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="广告URL:"
            name="url">
            <a-input
              v-model:value="form.url"
              placeholder="请输入广告URL"
              allow-clear/>
          </a-form-item>
          <a-form-item label="广告宽度:" name="width">
            <a-input-number
              :min="0"
              class="ele-fluid"
              placeholder="请输入广告宽度"
              v-model:value="form.width"/>
          </a-form-item>
          <a-form-item
            label="开始时间:"
            name="startTime">
            <a-date-picker
              format="YYYY-MM-DD HH:mm:ss"
              show-time
              v-model:value="form.startTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择开始时间"
              class="ele-fluid"/>
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
            label="广告位:"
            name="adSortId">
            <a-select
              v-model:value="form.adSortId"
              placeholder="请选择广告位"
              allow-clear>
              <a-select-option
                v-for="(item, index) in adSortList"
                :key="index"
                :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="广告描述:"
            name="description">
            <a-input
              v-model:value="form.description"
              placeholder="请输入广告描述"
              allow-clear/>
          </a-form-item>
          <a-form-item label="广告状态：" name="status">
            <a-radio-group
              v-model:value="form.status">
              <a-radio :value="1">正常</a-radio>
              <a-radio :value="2">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="广告高度:" name="height">
            <a-input-number
              :min="0"
              class="ele-fluid"
              placeholder="请输入广告高度"
              v-model:value="form.height"/>
          </a-form-item>
          <a-form-item
            label="结束时间:"
            name="endTime">
            <a-date-picker
              format="YYYY-MM-DD HH:mm:ss"
              show-time
              v-model:value="form.endTime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
              class="ele-fluid"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import uploadImage from '@/components/uploadImage'
export default {
  name: 'AdEdit',
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
        title: [
          {required: true, message: '请输入广告标题', type: 'string', trigger: 'blur'}
        ],
        adSortId: [
          {required: true, message: '请选择所属广告位', type: 'number', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择广告类型', type: 'number', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择广告状态', type: 'number', trigger: 'blur'}
        ],
        sort: [
          {required: true, message: '请输入排序号', type: 'number', trigger: 'blur'}
        ]
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 广告位列表
      adSortList:[],
      // 图片上传目录
      updDir: 'ad',
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {type:1, status:1};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  mounted() {
    // 查询广告位列表
    this.getAdSortList();
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/ad/edit' : '/system/ad/add', this.form).then(res => {
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
    /* 查询广告位列表 */
    getAdSortList() {
      this.$http.get('/system/adsort/getAdSortList').then(res => {
        if (res.data.code === 0) {
          this.adSortList = res.data.data;
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
