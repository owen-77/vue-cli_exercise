<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="danger" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isMenuCollapse ? '64px' : '200px'">
        <div @click="toggleMenu">|||</div>
        <el-menu
          background-color="#444242"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isMenuCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
        >
          <el-submenu
            :index="index + ''"
            v-for="(item, index) in menuList"
            :key="index"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveActivePath('/' + subItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { homeMenuListApi } from '@/api'
export default {
  data() {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isMenuCollapse: false,
      activePath: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await homeMenuListApi()
      if (res.meta.status !== 200) return this.$message.error('获取菜单列表失败！')
      this.menuList = res.data
    },
    toggleMenu() {
      this.isMenuCollapse = !this.isMenuCollapse
    },
    saveActivePath(path) {
      this.activePath = path
      window.sessionStorage.activePath = path
    }
  },
  created() {
    this.$message.closeAll()
    this.$message({
      type: 'success',
      message: '成功进入后台管理系统',
      showClose: true
    })
    this.getMenuList()
    this.activePath = window.sessionStorage.activePath
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  user-select: none;

  .el-header {
    background-color: #272727;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;

    > div {
      display: flex;
      align-items: center;

      > span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #444242;
    overflow: hidden;

    > div {
      height: 24px;
      background-color: #2b4b6b;
      color: #fff;
      text-align: center;
      line-height: 24px;
      letter-spacing: 0.2em;
      cursor: pointer;
    }

    .el-menu {
      border-right: 0;

      .iconfont {
        margin-right: 5px;
      }
    }
  }

  .el-main {
    background-color: #e0e0e0;
    overflow: hidden;
  }
}
</style>
