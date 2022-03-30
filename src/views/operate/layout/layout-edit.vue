<!-- 布局编辑弹窗 -->
<template>
  <a-modal
    :width="550"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改布局':'添加布局'"
    :body-style="{paddingBottom: '8px'}"
    @update:visible="updateVisible"
    @ok="save">
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{md: {span: 5}, sm: {span: 24}}"
      :wrapper-col="{md: {span: 19}, sm: {span: 24}}">
      <a-form-item 
        label="布局图片:"
        :label-col="{sm: {span: 5}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <uploadImage :limit="10" :updDir="updDir" v-model:value="form.image"/>
      </a-form-item>
      <a-form-item
        label="所属站点:"
        name="itemId">
        <a-select
          v-model:value="form.itemId"
          placeholder="请选择所属站点"
          allow-clear 
          @change="handleChange">
          <a-select-option
            v-for="(item, index) in itemList"
            :key="index"
            :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="布局位置:"
        name="layoutDesc">
        <a-select
          v-model:value="form.layoutDesc"
          placeholder="请选择布局位置"
          allow-clear
          @change="locDescChange">
          <a-select-option
            v-for="(item, index) in layoutDescList"
            :key="index"
            :value="item.id+','+item.locDesc">
            {{ item.layoutDesc }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="布局类型:"
        name="type">
        <a-select
          v-model:value="form.type"
          placeholder="请选择布局类型"
          allow-clear>
          <a-select-option :value="1">CMS文章</a-select-option>
          <a-select-option :value="2">通知公告</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="布局类型ID:"
        name="typeId">
        <a-input
          v-model:value="form.typeId"
          placeholder="请输入布局类型ID"
          allow-clear/>
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
import uploadImage from '@/components/uploadImage'
export default {
  name: 'LayoutEdit',
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
        itemId: [
          {required: true, message: '请选择站点', type: 'number', trigger: 'blur'}
        ],
        layoutDesc: [
          {required: true, message: '请输入布局位置', type: 'string', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择布局类型', type: 'number', trigger: 'blur'}
        ],
        typeId: [
          {required: true, message: '请输入布局类型ID', type: 'string', trigger: 'blur'}
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
      // 布局位置
      layoutDescList: [],
      // 图片上传目录
      updDir: 'layout',
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data, {
          layoutDesc: this.data.locDesc,
        });
        this.isUpdate = true;
      } else {
        this.form = {type: 1};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  mounted() {
    // 查询站点列表
    this.getItemList();
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/layout/edit' : '/system/layout/add', this.form).then(res => {
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
    getItemList() {
      this.$http.get('/system/item/getItemList').then(res => {
        if (res.data.code === 0) {
          this.itemList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 站点选择
     */
    handleChange(value) {
      if (!value) {
        return false;
      }
      this.$http.get('/layoutdesc/getLayoutDescList?itemId=' + value).then(res => {
        if (res.data.code === 0) {
          this.layoutDescList = res.data.data.map(d => {
            d.layoutDesc = d.locDesc + " => " + d.loc_id;
            return d;
          });
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 布局描述选择
     */
    locDescChange(value) {
      if (!value) {
        return false;
      }
      let item =value.split(",")
      this.form = Object.assign({}, this.form, {
        loc_id: item[0],
        locDesc: item[1]
      });
    }
  }
}
</script>

<style scoped>
</style>
