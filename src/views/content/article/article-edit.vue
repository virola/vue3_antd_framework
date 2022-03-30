<!-- 文章编辑弹窗 -->
<template>
  <a-form
    ref="form"
    :model="form"
    :rules="rules"
    :label-col="{md: {span: 6}, sm: {span: 24}}"
    :wrapper-col="{md: {span: 19}, sm: {span: 24}}">
    <a-form-item 
      label="文章封面:"
      :label-col="{sm: {span: 3}, xs: {span: 6}}"
      :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
      <uploadImage :limit="1" v-model:value="form.cover"/>
    </a-form-item>
    <a-row :gutter="16">
      <a-col :md="12" :sm="24" :xs="24">
        <a-form-item
          label="文章标题:"
          name="title">
          <a-input
            v-model:value="form.title"
            placeholder="请输入文章标题"
            allow-clear/>
        </a-form-item>
        <a-form-item label="文章状态:" name="status">
          <a-radio-group
            v-model:value="form.status">
            <a-radio :value="1">正常</a-radio>
            <a-radio :value="2">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
      <a-col :md="12" :sm="24" :xs="24">
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
      </a-col>
    </a-row>
    <a-form-item 
      label="文章图集:"
      :label-col="{sm: {span: 3}, xs: {span: 6}}"
      :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
      <uploadImage :limit="10" :isMultiple="true" :updDir="updDir" v-model:value="form.imgsList"/>
    </a-form-item>
    <a-form-item label="文章简介:"
      :label-col="{sm: {span: 3}, xs: {span: 6}}"
      :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
      <a-textarea
        v-model:value="form.intro"
        placeholder="请输入文章简介:"
        :rows="3"/>
    </a-form-item>
    <a-form-item
      label="文章内容:"
      :label-col="{sm: {span: 3}, xs: {span: 6}}"
      :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
      <!-- 编辑器 -->
      <tinymce-editor
        v-model:value="form.content"
        :init="initEditor"/>
    </a-form-item>
    <a-form-item :wrapper-col="{md: {offset: 3}}">
      <a-space size="middle">
        <a-button @click="$emit('close')">关闭</a-button>
        <a-button
          type="primary"
          @click="save"
          :loading="loading">提交
        </a-button>
       
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script>
import uploadImage from '@/components/uploadImage'
import TinymceEditor from '@/components/TinymceEditor';

export default {
  name: 'ArticleEdit',
  emits: ['done', 'update:visible'],
  components: {uploadImage, TinymceEditor},
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
          {required: true, message: '请输入文章标题', type: 'string', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择文章状态', type: 'number', trigger: 'blur'}
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
      cateList: [],
      // 图片上传目录
      updDir: 'article',
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data);
        this.isUpdate = true;
      } else {
        this.form = {status: 1, content: ""};
        this.isUpdate = false;
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  computed: {
    /**
     * 初始化编辑器
     */
    initEditor() {
      return {
        height: 300,
        branding: false,
        skin_url: '/tinymce/skins/ui/oxide',
        content_css: '/tinymce/skins/content/default/content.css',
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        plugins: 'code print preview fullscreen paste searchreplace save autosave link autolink image imagetools media table codesample lists advlist hr charmap emoticons anchor directionality pagebreak quickbars nonbreaking visualblocks visualchars wordcount',
        toolbar: 'fullscreen preview code | undo redo | forecolor backcolor | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | formatselect fontselect fontsizeselect | link image media emoticons charmap anchor pagebreak codesample | ltr rtl',
        toolbar_drawer: 'sliding',
        images_upload_handler: (blobInfo, success, error) => {
          let file = blobInfo.blob();
          // 使用axios上传
          const formData = new FormData();
          formData.append('file', file, file.name);
          this.$http.post('/system/upload/uploadImage/' + this.updDir, formData).then(res => {
            if (res.data.code == 0) { 
              success(res.data.data); 
            } else { 
              error(res.data.msg); 
            }
          }).catch(e => {
            console.error(e);
            error(e.message);
          });
        },
        file_picker_types: 'media',
        file_picker_callback: () => {
        }
      };
    }
  },
  mounted() {
    // 查询栏目列表
    this.getCateList();
  },
  methods: {
    /* 查询栏目列表 */
    getCateList() {
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
    },
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/article/edit' : '/system/article/add', this.form).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success(res.data.msg);
            if (!this.isUpdate) {
              this.form = {};
            }
            this.updateVisible(false);
            this.$emit('close');
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
