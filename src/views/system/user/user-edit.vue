<!-- 用户编辑弹窗 -->
<template>
  <a-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate?'修改用户':'新建用户'"
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
          <a-form-item label="用户姓名:" name="realname">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入用户姓名"
              v-model:value="form.realname"/>
          </a-form-item>
          <a-form-item
            label="邮箱:"
            name="email">
            <a-input
              v-model:value="form.email"
              placeholder="请输入邮箱"
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
              <a-select-option :value="3">保密</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="职级:"
            name="levelId">
            <a-select
              v-model:value="form.levelId"
              placeholder="请选择职级"
              allow-clear>
              <a-select-option
                v-for="(item, index) in levelList"
                :key="index"
                :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="所属部门:" name="deptId">
            <a-tree-select
              allow-clear
              :tree-data="deptList"
              tree-default-expand-all
              placeholder="请选择所属部门"
              v-model:value="form.deptId"
              :dropdown-style="{maxHeight: '360px', overflow: 'auto'}"/>
          </a-form-item>
          <a-form-item label="排序号:" name="sort">
            <a-input-number
              :min="0"
              class="ele-fluid"
              placeholder="请输入排序号"
              v-model:value="form.sort"/>
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
          <a-form-item
            label="用户账号:"
            name="username">
            <a-input
              v-model:value="form.username"
              placeholder="请输入用户账号"
              allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :md="12" :sm="24" :xs="24">
          <a-form-item
            label="用户昵称:"
            name="nickname">
            <a-input
              v-model:value="form.nickname"
              placeholder="请输入用户昵称"
              allow-clear/>
          </a-form-item>
          <a-form-item
            label="手机号:"
            name="mobile">
            <a-input
              v-model:value="form.mobile"
              placeholder="请输入手机号"
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
            label="岗位:"
            name="positionId">
            <a-select
              v-model:value="form.positionId"
              placeholder="请选择岗位"
              allow-clear>
              <a-select-option
                v-for="(item, index) in positionList"
                :key="index"
                :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="状态" name="status">
            <a-radio-group
              v-model:value="form.status">
              <a-radio :value="1">正常</a-radio>
              <a-radio :value="2">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="角色:"
            name="roleIds">
            <a-select
              v-model:value="form.roleIds"
              placeholder="请选择角色"
              allow-clear
              mode="multiple">
              <a-select-option
                v-for="(item, index) in roleList"
                :key="index"
                :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            label="详细地址:"
            name="address">
            <a-input
              v-model:value="form.address"
              placeholder="请输入详细地址"
              allow-clear/>
          </a-form-item>
          <a-form-item
            v-if="!isUpdate"
            label="登录密码:"
            name="password">
            <a-input-password
              v-model:value="form.password"
              placeholder="请输入登录密码"/>
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
import validate from 'ele-admin-pro/packages/validate';
import regions from 'ele-admin-pro/packages/regions.js';
import uploadImage from '@/components/uploadImage'

export default {
  name: 'UserEdit',
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
        realname: [
          {required: true, message: '请输入用户姓名', type: 'string', trigger: 'blur'}
        ],
        nickname: [
          {required: true, message: '请输入用户昵称', type: 'string', trigger: 'blur'}
        ],
        mobile: [
          {pattern: validate.phone, message: '手机号格式不正确', type: 'string', trigger: 'blur'}
        ],
        gender: [
          {required: true, message: '请选择性别', type: 'number', trigger: 'blur'}
        ],
        roleIds: [
          {required: true, message: '请选择角色', type: 'array', trigger: 'blur'}
        ],
        city: [
          {required: true, message: '请选择省市区', type: 'array', trigger: 'blur'}
        ],
        username: [
          {required: true, message: '请输入用户账号', type: 'string', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入登录密码', type: 'string', trigger: 'blur'}
        ],
      },
      // 提交状态
      loading: false,
      // 是否是修改
      isUpdate: false,
      // 角色列表
      roleList: [],
      // 职级列表
      levelList: [],
      // 岗位列表
      positionList: [],
      // 部门列表
      deptList: [],
      // 省市区数据
      cityData: regions,
      // 选中的省市
      provinceCity: [],
      // 选中的省
      province: [],
      // 图片上传目录
      updDir: 'user',
    };
  },
  watch: {
    data() {
      if (this.data) {
        this.form = Object.assign({}, this.data, {
          roleIds: this.data.roles.map(d => d.id)
        });
        this.isUpdate = true;
        // 清空密码输入框
        this.form.password = ''
      } else {
        this.form = {gender: 1, status: 1};
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
    this.queryRoles();  // 查询角色列表
    this.queryLevelList(); // 查询职级列表
    this.queryPositionList(); // 查询岗位列表
    this.queryDeptList(); // 查询部门列表
  },
  methods: {
    /* 保存编辑 */
    save() {
      this.$refs.form.validate().then(() => {
        this.loading = true;
        this.$http[this.isUpdate ? 'put' : 'post'](this.isUpdate ? '/system/user/edit' : '/system/user/add', Object.assign({}, this.form)).then(res => {
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
    queryRoles() {
      this.$http.get('/system/role/getRoleList').then(res => {
        if (res.data.code === 0) {
          this.roleList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取职级列表
     */
    queryLevelList() {
      this.$http.get('/system/level/getLevelList').then(res => {
        if (res.data.code === 0) {
          this.levelList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取岗位列表
     */
    queryPositionList() {
      this.$http.get('/system/position/getPositionList').then(res => {
        if (res.data.code === 0) {
          this.positionList = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        this.$message.error(e.message);
      });
    },
    /**
     * 获取部门列表
     */
    queryDeptList() {
      this.$http.get('/system/dept/getDeptList').then(res => {
        if (res.data.code === 0) {
          this.deptList = this.$util.toTreeData(res.data.data.map(d => {
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
    }
  }
}
</script>

<style scoped>
</style>
