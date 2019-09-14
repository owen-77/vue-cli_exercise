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
            <el-input
              v-model="queryInfo.query"
              clearable
              @clear="selectUser"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="selectUser"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialog = true"
              >添加用户</el-button
            >
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
              <el-switch
                v-model="scope.row.mg_state"
                @change="changeUserState(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="+queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="+total"
        >
        </el-pagination>
      </el-card>
      <el-dialog
        title="提示"
        :visible.sync="addDialog"
        width="50%"
        center
        @close="closeAddDialog"
      >
        <span>
          <el-form
            label-width="80px"
            :model="addForm"
            status-icon
            :rules="addFormRules"
            ref="addFormRef"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="editDialog" width="50%" center>
        <span>
          <el-form
            label-width="80px"
            :model="editForm"
            status-icon
            :rules="editFormRules"
            ref="editFormRef"
          >
            <el-form-item label="用户名" prop="username">
              <el-input v-model="editForm.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱地址" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  userListApi,
  changeUserStateApi,
  addUserApi,
  delUserApi,
  findUserApi,
  editUserApi
} from '@/api'
export default {
  data() {
    let validEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的邮箱地址'))
    }
    let validMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码'))
    }
    return {
      userList: [],
      queryInfo: {
        query: '',
        pagenum: '1',
        pagesize: '3'
      },
      currentPage: 1,
      pageNum: '',
      total: '',
      addDialog: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在 3 ~ 10 个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码的长度在 6 ~ 15 个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ]
      },
      editDialog: false,
      editForm: {},
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: validEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async init() {
      const { data: res } = await userListApi(this.queryInfo)
      if (res.meta.status !== 200)
        return this.$message.error('获取用户列表失败！')
      this.userList = res.data.users
      this.pageNum = res.data.pagenum
      this.total = res.data.total
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.init()
    },
    async changeUserState(userInfo) {
      const { data: res } = await changeUserStateApi(userInfo)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('状态修改失败！')
      }
      this.$message.success('状态修改成功！')
    },
    selectUser() {
      this.queryInfo.pagenum = 1
      this.init()
    },
    addUser() {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await addUserApi(this.addForm)
        this.addDialog = false
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
      })
    },
    closeAddDialog() {
      this.$refs.addFormRef.resetFields()
    },
    async delUser(id) {
      const delResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (delResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await delUserApi(id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.init()
      this.$message.success('删除成功！')
    },
    async showEditDialog(id) {
      const { data: res } = await findUserApi(id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败！')
      }
      this.editForm = res.data
      this.editDialog = true
    },
    editUser() {
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await editUserApi(this.editForm)
        this.editDialog = false
        if (res.meta.status !== 200) {
          return this.$message.error('修改失败！')
        }
        this.init()
        this.$message.success('修改成功！')
      })
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
