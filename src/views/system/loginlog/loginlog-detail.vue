<!-- 详情弹窗 -->
<template>
  <a-modal
    title="日志详情"
    :width="550"
    :footer="null"
    :visible="visible"
    @update:visible="updateVisible">
    <a-form
      class="ele-form-detail"
      :label-col="{sm: {span: 8}, xs: {span: 6}}"
      :wrapper-col="{sm: {span: 16}, xs: {span: 18}}">
      <a-row :gutter="16">
        <a-col :sm="12" :xs="24">
          <a-form-item label="操作账号:">
            <div class="ele-text-secondary">
              {{ data.username }}
            </div>
          </a-form-item>
          <a-form-item label="请求IP:">
            <div class="ele-text-secondary">
              {{ data.loginIp }}
            </div>
          </a-form-item>
          <a-form-item label="操作系统:">
            <div class="ele-text-secondary">
              {{ data.os }}
            </div>
          </a-form-item>
          <a-form-item label="操作类型:">
            <div class="ele-text-secondary">
              <a-tag :color="['green', 'red', '', 'orange'][data.type-1]">
                {{ ['登录成功', '登录失败', '退出登录', '刷新TOKEN'][data.type-1] }}
              </a-tag>
            </div>
          </a-form-item>
        </a-col>
        <a-col :sm="12" :xs="24">
          <a-form-item label="日志标题:">
            <div class="ele-text-secondary">
              {{ data.title }}
            </div>
          </a-form-item>
          <a-form-item label="操作浏览器:">
            <div class="ele-text-secondary">
              {{ data.browser }}
            </div>
          </a-form-item>
          <a-form-item label="日志状态:">
            <div class="ele-text-secondary">
              <a-tag :color="['green', 'red'][data.status]">
                {{ ['成功', '失败'][data.status] }}
              </a-tag>
            </div>
          </a-form-item>
           <a-form-item label="操作时间:">
            <div class="ele-text-secondary">
              {{ $util.toDateString(data.createTime) }}
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <div style="margin: 12px 0;">
        <a-divider/>
      </div>
      <a-form-item
        label="日志备注:"
        :label-col="{sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <div class="ele-text-secondary">
          {{ data.note }}
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  name: 'LoginlogDetail',
  emits: ['update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 数据
    data: Object
  },
  methods: {
    /* 更新visible */
    updateVisible(value) {
      this.$emit('update:visible', value);
    }
  }
}
</script>

<style scoped>
</style>
