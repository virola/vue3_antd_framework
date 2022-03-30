<!-- 会员编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改会员':'新建会员'"
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
        label="头像:"
        name="avatar"
        :label-col="{sm: {span: 3}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
        <uploadImage :limit="1" :updDir="updDir" v-model:value="form.avatar"/>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item
            label="会员账号:"
            name="username">
            <a-input
              v-model:value="form.username"
              placeholder="请输入会员账号"
              allow-clear/>
          </a-form-item>
          <a-form-item
            label="会员姓名:"
            name="realname">
            <a-input
              v-model:value="form.realname"
              placeholder="请输入会员姓名"
              allow-clear/>
          </a-form-item>
          <a-form-item
            label="出生日期:"
            name="birthday">
            <a-date-picker
              v-model:value="form.birthday"
              value-format="YYYY-MM-DD"
              placeholder="请选择出生日期"
              class="ele-fluid"/>
          </a-form-item>
          <a-form-item
            label="设备类型:"
            name="device">
            <a-select
              v-model:value="form.device"
              placeholder="请选择设备类型"
              allow-clear>
              <a-select-option :value="1">苹果</a-select-option>
              <a-select-option :value="2">安卓</a-select-option>
              <a-select-option :value="3">WAP站</a-select-option>
              <a-select-option :value="4">PC站</a-select-option>
              <a-select-option :value="5">后台</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="所在城市:"
            name="city">
            <a-cascader
              v-model:value="form.city"
              :options="cityData.cityData"
              placeholder="请选择所在城市"
              popup-class-name="ele-pop-wrap-higher"/>
          </a-form-item>
          <a-form-item label="个人简介:">
            <a-textarea
              v-model:value="form.intro"
              placeholder="请输入个人简介"
              :rows="4"/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item
            label="会员等级:"
            name="memberLevel">
            <a-select
              v-model:value="form.memberLevel"
              placeholder="请选择会员等级"
              allow-clear>
              <a-select-option
                v-for="(item, index) in memberLevelList"
                :key="index"
                :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="会员昵称:"
            name="nickname">
            <a-input
              v-model:value="form.nickname"
              placeholder="请输入会员昵称"
              allow-clear/>
          </a-form-item>
          <a-form-item
            label="性别:"
            name="gender">
            <a-select
              v-model:value="form.gender"
              placeholder="请选择性别"
              allow-clear>
              <a-select-option :value="1">男</a-select-option>
              <a-select-option :value="2">女</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="会员来源:"
            name="source">
            <a-select
              v-model:value="form.source"
              placeholder="请选择会员来源"
              allow-clear>
              <a-select-option :value="1">APP客户端</a-select-option>
              <a-select-option :value="2">后台添加</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="会员状态:" name="status">
            <a-radio-group
              v-model:value="form.status">
              <a-radio :value="1">正常</a-radio>
              <a-radio :value="2">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="个人签名:">
            <a-textarea
              v-model:value="form.signature"
              placeholder="请输入个人签名"
              :rows="4"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="个人简介:"
        :label-col="{sm: {span: 3}, xs: {span: 6}}"
        :wrapper-col="{sm: {span: 21}, xs: {span: 18}}">
        <a-textarea
          v-model:value="form.intro"
          placeholder="请输入个人简介"
          :rows="4"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import regions from 'ele-admin-pro/packages/regions.js';
import uploadImage from '@/components/uploadImage'

export default {
  name: 'MemberEdit',
  emits: ['done', 'update:visible'],
  props: {
    // 弹窗是否打开
    visible: Boolean,
    // 修改回显的数据
    data: Object
  },
  components: {uploadImage},
  data() {
    return {
      // 表单数据
      form: Object.assign({}, this.data),
      // 表单验证规则
      rules: {
        username: [
          {required: true, message: '请输入会员账号', type: 'string', trigger: 'blur'}
        ],
        memberLevel: [
          {required: true, message: '请选择会员等级', type: 'number', trigger: 'blur'}
        ],
        realname: [
          {required: true, message: '请输入会员名称', type: 'string', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入会员名', type: 'string', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', type: 'number', trigger: 'blur'}
        ],
        device: [
          {required: true, message: '请选择设备类型', type: 'number', trigger: 'blur'}
        ],
        source: [
          {required: true, message: '请选择注册来源', type: 'number', trigger: 'blur'}
        ],
        city: [
          {required: true, message: '请选择省市区', type: 'array', trigger: 'blur'}
        ],
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 会员等级列表
      memberLevelList: [],
      // 省市区数据
      cityData: regions,
      // 选中的省市
      provinceCity: [],
      // 选中的省
      province: [],
      // 图片上传目录
      updDir: 'member',
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data, {
        });
        this.isUpdate = true;
      } else {
        this.form = {device:1, source:1, gender:1, status : 1};
        this.isUpdate = false;
        // 清空城市选项
        this.form.city = [];
      }
      if (this.$refs.form) {
        this.$refs.form.clearValidate();
      }
    }
  },
  mounted() {
    // 查询会员等级列表
    this.queryMemberLevelList();
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/member/member/edit' : '/member/member/add', Object.assign({}, this.form)).then(res => {
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
    /* 查询角色列表 */
    queryMemberLevelList() {
      this.$http.get('/member/memberlevel/getMemberLevelList').then(res => {
        if (res.data.code === 0) {
          this.memberLevelList = res.data.data;
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
