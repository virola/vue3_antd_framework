<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <a-form
        :model="where"
        :label-col="{md: {span: 6}, sm: {span: 24}}"
        :wrapper-col="{md: {span: 18}, sm: {span: 24}}">
        <a-row>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item label="城市名称:">
              <a-input
                v-model:value.trim="where.name"
                placeholder="请输入城市名称"
                allow-clear/>
            </a-form-item>
          </a-col>
          <a-col :lg="6" :md="12" :sm="24" :xs="24">
            <a-form-item style="padding-left:10px;" :wrapper-col="{span: 24}">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 表格 -->
      <ele-pro-table
        ref="table"
        row-key="id"
        :datasource="url"
        :columns="columns"
        :where="where"
        :need-page="false"
        :parse-data="parseData"
        :expand-icon-column-index="1"
        :expanded-row-keys="expandedRowKeys"
        :scroll="{x: 'max-content'}"
        @expandedRowsChange="onExpandedRowsChange">
        <template #toolbar>
          <a-space>
            <a-button type="primary" @click="openEdit()" v-if="permission.includes('sys:city:add')">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
          </a-space>
        </template>
        <!-- 城市等级 -->
        <template #level="{ record }">
          <a-tag
            :color="['blue', 'green', 'orange'][record.level-1]">
            {{ ['省份', '城市', '县区'][record.level-1] }}
          </a-tag>
        </template>
        <!-- 操作栏 -->
        <template #action="{ record }">
          <a-space>
            <a @click="showChildren(record)" v-if="permission.includes('sys:city:addz')">添加县区</a>
            <a-divider type="vertical"/>
            <a @click="openEdit(record)" v-if="permission.includes('sys:city:edit')">修改</a>
            <a-divider type="vertical"/>
            <a-popconfirm @confirm="remove(record)" title="确定要删除此城市吗？">
              <a class="ele-text-danger" v-if="permission.includes('sys:city:delete')">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
  <!-- 编辑弹窗 -->
  <city-edit
    v-model:visible="showEdit"
    :data="current"
    :city-list="cityList"
    @done="reload"/>

  <a-drawer
    title="县区列表"
    :width="'calc(100vw - 215px)'"
    :placement="placement"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    @close="onClose">
    <!-- 编辑窗口 -->
    <index-district
      :cityId="cityId"
      @close="onClose"/>
  </a-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import {PlusOutlined} from '@ant-design/icons-vue';
import CityEdit from './city-edit';
import IndexDistrict from './index-district';

export default {
  name: 'SystemCity',
  emits: [
    'close',
    'update:visible'
  ],
  components: {PlusOutlined, CityEdit,IndexDistrict},
  computed: {
    url() {
      return '/system/city/index?pid=' + this.provinceId;
    },
    ...mapGetters(["permission"]),
  },
  props: {
    // 省份ID
    provinceId: Number,
  },
  data() {
    return {
      // 表格列配置
      columns: [
        {
          dataIndex: 'id',
          title: '编号',
          width: 48,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '城市名称',
          dataIndex: 'name',
          align: 'center',
        },
        {
          title: '城市等级',
          dataIndex: 'level',
          align: 'center',
          slots: {customRender: 'level'}
        },
        {
          title: '城市编码',
          dataIndex: 'citycode',
          align: 'center'
        },
        {
          title: '地里编码',
          dataIndex: 'adcode',
          align: 'center'
        },
        {
          title: '经度',
          dataIndex: 'lng',
          align: 'center'
        },
        {
          title: '纬度',
          dataIndex: 'lat',
          align: 'center'
        },
        {
          title: '排序',
          dataIndex: 'sort',
          sorter: true,
          align: 'center'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          align: 'center',
          customRender: ({text}) => this.$util.toDateString(text)
        },
        {
          title: '操作',
          key: 'action',
          width: 200,
          align: 'center',
          fixed: 'right',
          slots: {customRender: 'action'}
        }
      ],
      // 表格搜索条件
      where: {},
      // 表格选中数据
      selection: [],
      // 当前编辑数据
      current: null,
      // 是否显示编辑弹窗
      showEdit: false,
      // 表格展开的行
      expandedRowKeys: [],
      // 全部城市数据
      cityList: [],
      visible: false,
      placement: 'right',
      // 城市ID
      cityId: 0,
    };
  },
  methods: {
    /* 解析接口返回数据 */
    parseData(res) {
      res.data = this.$util.toTreeData(res.data.map(d => {
        d.key = d.id;
        d.value = d.id;
        d.title = d.name;
        return d;
      }), 'id', 'pid');
      if (!Object.keys(this.where).length) {
        this.cityList = res.data;
      }
      if (!this.expandedRowKeys.length) {
        this.expandAll();
      }
      // return res;
      return {
        code : res.code,
        msg : res.msg,
        data : {
          records : res.data
        }
      };
    },
    /* 刷新表格 */
    reload() {
      this.$refs.table.reload();
    },
    /* 重置搜索 */
    reset() {
      this.where = {};
      this.$nextTick(() => {
        this.reload();
      });
    },
    /* 打开编辑弹窗 */
    openEdit(row, pid) {
      this.current = Object.assign({
        pid: pid
      }, row);
      this.showEdit = true;
    },
    /* 删除单个 */
    remove(row) {
      if (row.children && row.children.length > 0) {
        this.$message.error('请先删除子节点');
        return;
      }
      const hide = this.$message.loading('请求中..', 0);
      this.$http.delete('/system/city/delete/' + [row.id]).then(res => {
        hide();
        if (res.data.code === 0) {
          this.$message.success(res.data.msg);
          this.reload();
        } else {
          this.$message.error(res.data.msg);
        }
      }).catch(e => {
        hide();
        this.$message.error(e.message);
      });
    },
    /* 展开全部 */
    expandAll() {
      let keys = [];
      this.$util.eachTreeData(this.cityList, (d) => {
        if (d.children && d.children.length) {
          keys.push(d.id);
        }
      });
      this.expandedRowKeys = keys;
    },
    /* 折叠全部 */
    foldAll() {
      this.expandedRowKeys = [];
    },
    /* 展开的行变化 */
    onExpandedRowsChange(expandedRows) {
      this.expandedRowKeys = expandedRows;
    },
    /**
     * 获取城市
     */
    showChildren(record) {
      // 城市ID
      this.cityId = record.id;
      this.showDrawer();
    },
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    onChange(e) {
      this.placement = e.target.value;
    }
  }
}
</script>

<style scoped>
</style>
