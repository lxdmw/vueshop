<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-seleect" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button @click="getUserList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)" ></el-button>
             <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
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

    
    <!-- 渲染添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="60%"
      >
      <!-- 内容主体区域 -->
      <!-- <span>这是一段信息</span> -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" class="demo-ruleForm" @close="addDialogClose">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"  type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>


      </el-form>
      <!-- 底部信息 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>



     <!-- 渲染修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="60%"
      @close="editDialogClose"
      >
      <!-- 内容主体区域 -->
      <!-- <span>这是一段信息</span> -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px" class="demo-ruleForm" @close="editDialogClose">
        <el-form-item label="用户名" >
            <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱" >
            <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机" >
            <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>


      </el-form>
      <!-- 底部信息 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo" >确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { async } from 'q';

export default {
 
  created(){
    this.getUserList()
  },
  data () {
    // 验证邮箱的规则
    var checkEmail  = (rule,value,cb)=>{
      const regEmail  = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if(regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则

    var checkMobile = (rule,value,cb)=>{
      const regMobile  = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if(regMobile.test(value)){
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      //获取用户列表
      queryInfo:{
        query:'',// 查询关键字
        pagenum:1,// 当前页码
        pagesize:2 // 每页数据条数
      },
      userlist:[],// 用户数据
      total:0,// 用户数据总条数
      addDialogVisible:false,
      editDialogVisible:false,
      addForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
      },
      editForm:{},
      addFormRules:{
        username:[
          {required:true,message:'请输入用户名',trigger:'blur'},
          {min:3,max:10,message:'用户名长度在3到10个字之间',trigger:'blur'}
        ],
        password:[
          {required:true,message:'请输入密码呀',trigger:'blur'},
          {min:3,max:10,message:'密码长度在3到10个字之间',trigger:'blur'}
        ],
        email:[
          {required:true,message:'请输入邮箱哦',trigger:'blur'},
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          {required:true,message:'请输入手机号哦',trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}
        ],

      },
      editFormRules:{
        email:[
          {required:true,message:'请输入邮箱哦',trigger:'blur'},
          {validator:checkEmail,trigger:'blur'}
        ],
        mobile:[
          {required:true,message:'请输入手机号哦',trigger:'blur'},
          {validator:checkMobile,trigger:'blur'}
        ],
      }
    };
  },
  
  methods:{
    // 获取用户列表
    async getUserList(){
      const {data:res} = await this.$http.get('users',{
        params: this.queryInfo
      })
      if (res.meta.status != 200) {
        return this.$message.error('找不到用户列表....QAQ')
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
    // 添加对话框的关闭事件
    addDialogClose(){
      this.$refs.addFormRef.resetFields()
    },
    
    // 添加新用户
    addUser(){
      // 预校验
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid) return
        // 可以发起添加用户的网络请求
        const {data:res} = await this.$http.post('users',this.addForm)
        if(res.meta.status !=201) {
          this.$message.error('添加用户失败::>_<::')
        }
        this.$message.success('添加用户成功!(*^__^*)')
        this.addDialogVisible  =false
        this.getUserList()
      })
      
    },
    // 修改对话框的关闭事件
    editDialogClose(){
       this.$refs.editFormRef.resetFields()
    },

    // 修改用户信息-展示编辑用户的对话框
    async showEditDialog(id){
      // console.log(id);
      const {data:res} = await this.$http.get('users/' + id)
      if(res.meta.status != 200 ) return this.$message.error('查询用户信息失败')
      this.editForm  = res.data
      this. editDialogVisible= true
      
    },
    // 修改表单的提交事件
    editFormInfo() {
      this.$refs.editFormRef.validate(async valid=>{
        if(!valid) return 
        // 发起修改用户信息的数据请求
        const {data:res} = await this.$http.put('users/' + this.editForm.id,
        {email:this.editForm.email,mobile:this.editForm.mobile})
        if(res.meta.status != 200) return this.$message.error('更新失败..QAQ')

      })
      // 关闭对话框
      this.editDialogVisible = false
      // 刷新数据列表
      this.getUserList()
      // 提示修改成功
      this.$message.success('更新成功啦(*^__^*) 嘻嘻……')
    },
    // 删除用户功能
    // 询问是否确认删除
    async removeUserById(id){
      const confirmResult = await this.$confirm('此操作将永久删除该用户,是否继续','提示',{
        confirmButtonText:'sure',
        cancelButtonText:'not sure',
        type:'warning'
      }).catch(err=>console.log(err))
      if(confirmResult != 'confirm') {
        return this.$message.info('已取消了删除');
        
      }
      // 确认删除后调用api接口
      const {data:res} = await this.$http.delete('users/' + id)
      if(res.meta.status != 200) return this.$message.error('删除失败.....QAQ')
      return this.$message.success('删除成功了哦(*^__^*)')
      this.getUserList();
    }

  

  }
}
</script>
<style lang='less' scoped>
  
</style>