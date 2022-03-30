<!-- 用户导入弹窗 -->
<template>
  <a-modal
    :width="520"
    :footer="null"
    title="导入职级"
    :visible="visible"
    @update:visible="updateVisible">
    <a-spin :spinning="loading">
      <a-upload-dragger
        accept=".xls,.xlsx"
        :show-upload-list="false"
        :customRequest="doUpload"
        style="padding: 24px 0;margin-bottom: 16px;">
        <p class="ant-upload-drag-icon">
          <cloud-upload-outlined/>
        </p>
        <p class="ant-upload-hint">将文件拖到此处，或点击上传</p>
      </a-upload-dragger>
    </a-spin>
    <div class="ele-text-center">
      <span>只能上传xls、xlsx文件，</span>
      <a @click="downloadExcel">下载模板
      </a>
    </div>
  </a-modal>
</template>

<script>
import {CloudUploadOutlined} from '@ant-design/icons-vue';

export default {
  name: 'LevelImport',
  components: {CloudUploadOutlined},
  emits: ['done', 'update:visible'],
  props: {
    // 是否打开弹窗
    visible: Boolean
  },
  data() {
    return {
      // 导入请求状态
      loading: false
    };
  },
  methods: {
    /* 上传 */
    doUpload({file}) {
      this.loading = true;
      let formData = new FormData();
      formData.append('file', file);
      this.$http.post('/system/level/importExcel/files', formData).then(res => {
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
      return false;
    },
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    },
    /**
     * 下载模板
     */
    downloadExcel() {
      // 下载模板
      window.location.href = process.env.VUE_APP_UPLOAD_BASE_URL + "level.xlsx";
    }
  }
}
</script>

<style scoped>
</style>
