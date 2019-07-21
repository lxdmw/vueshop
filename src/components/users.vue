<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-seleect" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row >

      <!-- 表格数据渲染 -->
      <el-table :data="userlist">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
             <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页按钮
        size-change :切换每一页显示的数据的条数
        current-change 切换页面
        current-page 当前页面
        page-sizes 设置每一页显示的数据条数
        page-size 你选的每一页的数据条数
        total 总的数据条数-->
      <el-pagination 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created(){
    this.getUserList()
  },
  data () {
    return {
      //获取用户列表
      queryInfo:{
        query:'adm',// 查询关键字
        pagenum:1,// 当前页码
        pagesize:2 // 每页数据条数
      },
      userlist:[],// 用户数据
      total:0,// 用户数据总条数
    };
  },
  
  methods:{
    // 获取用户列表
    async getUserList(){
      const {data:res} = await this.$http.get('users',{
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.$message.error('找不到....QAQ')
       }
      this.userlist = res.data.users
      this.total = res.data.total
      
    },
    handleSizeChange(pagesize){
      this.queryInfo.pagesize = pagesize
      this.getUserList()
    },
    handleCurrentChange(pagenum){
      this.queryInfo.pagenum = pagenum
      this.getUserList()
    },
    // 用户列表-修改用户状态
    async userStateChanged(row){
      const {data: res} = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      if(res.meta.status != 200) return this.$message.error('修改用户状态失败QAQ')
      this.$message.success('修改用户状态成功了哦')
    },
  

  }
}
</script>
<style lang='less' scoped>
  
</style>