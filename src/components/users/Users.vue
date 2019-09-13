<template>
  <div>
    <div>
      <el-breadcrumb class="userArrow" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
        <el-table :data="userList" stripe border="">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="+userInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="+total"
        >
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<script>
import { userListApi } from '@/api'
export default {
  data() {
    return {
      userList: [],
      userInfo: {
        query: '',
        pagenum: '1',
        pagesize: '3'
      },
      currentPage: 1,
      pageNum: '',
      total: ''
    }
  },
  methods: {
    async init() {
      const { data: res } = await userListApi(this.userInfo)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      this.userList = res.data.users
      this.pageNum = res.data.pagenum
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.userInfo.pagesize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.userInfo.pagenum = val
      this.init()
    }
  },
  created() {
    this.init()
  }
}
</script>

<style>
.userArrow i.el-breadcrumb__separator {
  color: #ff4500;
}
</style>

<style lang="less" scoped>
</style>
