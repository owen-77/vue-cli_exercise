<template>
  <div>
    <el-button type="danger" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    }
  },
  created() {
    this.$message.closeAll()
    this.$message({
      type: 'success',
      message: '成功进入后台管理系统',
      showClose: true
    })
  }
}
</script>

<style lang="less" scoped>

</style>
