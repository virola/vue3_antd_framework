<!-- 详情弹窗 -->
<template>
  <a-modal
    title="日志详情"
    :width="750"
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
              {{ data.operName }}
            </div>
          </a-form-item>
          <a-form-item label="请求方式:">
            <div class="ele-text-secondary">
              {{ data.requestMethod }}
            </div>
          </a-form-item>
          <a-form-item label="操作方法:">
            <div class="ele-text-secondary">
              {{ data.operMethod }}
            </div>
          </a-form-item>
          <a-form-item label="操作类型:">
            <div class="ele-text-secondary">
              <a-tag :color="['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green','red'][data.logType-1]">
                {{ ['其他', '新增', '修改', '删除', '导出数据', '导入模板', '强退', '生成代码', '清空数据', '设置状态'][data.logType-1] }}
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
          <a-form-item label="操作模块:">
            <div class="ele-text-secondary">
              {{ data.title }}
            </div>
          </a-form-item>
          <a-form-item label="操作IP:">
            <div class="ele-text-secondary">
              {{ data.operIp }}
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
        label="操作URL:"
        :label-col="{sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <div class="ele-text-secondary">
          {{ data.operUrl }}
        </div>
      </a-form-item>
      <a-form-item
        label="请求参数:"
        :label-col="{sm: {span: 4}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 20}, xs: {span: 18}}">
        <div class="ele-text-secondary">
          {{ data.operParam }}
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
