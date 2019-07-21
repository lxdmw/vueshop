<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 角色添加区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
          
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
          <!-- 展开列 -->
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                <!-- 渲染一级权限 -->
                <el-col :span="5">
                  <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                  
                </el-col>
                <!-- 渲染二级和三级权限 -->
                <el-col :span="19">
                  <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2===0 ? '': 'bdtop']">
                    <el-col :span="5">
                      <el-tag type="success" closable
                      @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col >
                    <!-- 渲染三级权限 -->
                    <el-col :span="19" >
                      
                          <el-tag closable 
                          type="warning" 
                          v-for="(item3) in item2.children" :key="item3.id"
                          @close="removeRightById(scope.row,item3.id)">
                          {{item3.authName}}
                          </el-tag>
                       
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <!-- 索引列 -->
          <el-table-column type="index">

          </el-table-column>
          <el-table-column
            label="角色名称"
            prop=".roleName"
          >
          </el-table-column>
          <el-table-column
            label="角色描述"
            prop="roleDesc"
            >
          </el-table-column>
          <el-table-column
            label="操作"
            width="500px"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog()">分配权限</el-button>

            </template>
          </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="setRightDialogVisible"
      width="30%"
      >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  created(){
    this.getRolesLIst()
  },
  data () {
    return {
      rolesList : [],
      // 分配权限对话框默认关闭
      setRightDialogVisible:false
    };
  },
  methods:{
    async getRolesLIst(){
      const {data:res} = await this.$http.get('roles')
      if(res.meta.status != 200) return this.$message.error('请求不到数据哦 联系后台小哥哥~不是我的错哦....')
      console.log(res.data);
      this.rolesList = res.data
    },
    // 根据id删除对应的权限
    async removeRightById(role, rightId){
      const confirmResult = await this.$confirm('确定删除吗?','提示',{
        confirmButtonText:'sure',
        cancelButtonText:'not sure',
        type:'warning'
      }).catch(err=>err)
      console.log(confirmResult);
      
      if(confirmResult != 'confirm') {
        return this.$message.info('您已经取消了删除')
      }
      // console.log('删除啦!!');
      const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if(res.meta.status != 200) {
        return this.$message.error('删除权限失败')
      }
      this.$message.success('删除成功')
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(){
      const {data:res} = await this.$http.get('rights/tree') 
      if (res.meta.status != 200) return this.$message.error('获取权限失败')
      console.log('获取权限成功');
      this.rightlist = res.data
      this.setRightDialogVisible=true
    }
    
  }
}
</script>
<style lang='less' scoped>
  .el-tag {
    margin: 7px
  }
  .bdtop{
    border-top: 1px solid #ccc;
  }
  .bdbottom{
    border-bottom: 1px solid #ccc
  }
</style>