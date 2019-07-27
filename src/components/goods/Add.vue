<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>


    <!-- 卡片区域 -->
    <el-card>

      <!-- 警告区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false">
      </el-alert>
      
      <!-- 步骤条区域 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form :model="addForm" 
        :rules="addFormRules" 
        ref="addFormRef" 
        label-width="100px" 
        label-position="top">
        <el-tabs tab-position="left"  v-model="activeIndex"
        :before-leave="beforeTabLeave"
        @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="catProps"
                expandTrigger= "hover"
                @change="handleChange"
                ></el-cascader>

            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
                <!-- 复选框组 -->
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                  
                </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableDate" :key="item.attr_id">
              <el-input :value="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的后台api地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.good_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="add"> 添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="30%">
      <img :src="previewPath"  class="previewImg">
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
import { async } from 'q';

export default {
  created(){
    // 获取商品分类数据列表
    this.getCateList()
  },
  data () {
    return {
      // 步骤条当前步骤
      activeIndex:'0',
      // 表单数据
      addForm:{
        goods_name:'',
        goods_price:0,
        goods_weight:0,
        goods_number:0,
        // 商品所属的分类数组
        goods_cat:[],
        // 上传的图片地址
        pics:[],
        // 商品详情内容
        good_introduce:'',
        // 动态参数数组
        attrs:[]
      },
      // 表单验证规则
      addFormRules:{
        goods_name:[
          {required:true,message:'请输入商品名称',trigger:'blur'}
        ],
        goods_price:[
          {required:true,message:'请输入商品价格',trigger:'blur'}
        ],
        goods_weight:[
          {required:true,message:'请输入商品重量',trigger:'blur'}
        ],
        goods_number:[
          {required:true,message:'请输入商品数量',trigger:'blur'}        ],
        goods_cat:[
          {required:true,message:'请选择商品分类',trigger:'blur'}
        ]
      },
      // 商品分类列表
      cateList:[],
      // 级联选择器的规则
      catProps:{
        label:'cat_name',
        value:'cat_id',
        children:'children'
        
      },
      // 动态参数列表数据
      manyTableDate:[],
      // 静态属性列表数据
      onlyTableDate:[],
      // 上传图片的url地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 上传文件列表
      fileList:[],
      // 图片上传组件的headers请求头对象
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },
      // 图片预览显示隐藏
      dialogVisible:false,
      // 预览图片地址
      previewPath:''
      
    };
  },
  methods:{
    // 获取商品分类数据列表
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if (res.meta.status != 200) return this.$message.error('获取商品分类数据失败')

      this.cateList = res.data
    },
    // 监听级联选择器变化
    handleChange(){
      if(this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 监听标签页的切换
    beforeTabLeave(activeName,oldActiveName){
      if(oldActiveName == '0' && this.addForm.goods_cat.length != 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
      
    },
    // tab被选中时触发
    async tabClick(){
      // 如果选中的是商品参数
      if (this.activeIndex === "1") {
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:"many"}})

        if (res.meta.status !== 200) {
          return this.$message.error('请求动态参数列表失败')
        }

        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        
        
        this.manyTableDate = res.data
        
      } else if(this.activeIndex === '2' ) {  // 如果选中的是商品属性(静态属性)
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:"only"}})

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        console.log(res.data);
        this.onlyTableDate = res.data
        
      }
      

      
      
    },

    // 处理图片预览效果
    handlePreview(file){
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    // 移除图片
    handleRemove(file, fileList){
      // 1. 获取将要删除的图片的临时路径
      const filePath =file.response.data.tmp_path 
      // 2. 从pics数组中,查找到这个图片对应的index值
      const i = this.addForm.pics.findIndex(x => 
      x.pic == filePath)
      // 3. 通过index值删除图片
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功事件
    handleSuccess(response){
      // 拼接得到一个图片信息对象
      const picInfo = {pic: response.data.tmp_path}
      // 将图片信息对象push到pics数组中
      this.addForm.pics.push(picInfo)
    },
    // 添加商品按钮
    add(){
      console.log(this.addForm);
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 执行添加的业务逻辑

        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableDate.forEach(item=> {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        
        // 处理静态属性
        this.onlyTableDate.forEach(item=> {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form);
        const {data:res} = await this.$http.post('goods',form)
        if (res.meta.status != 201) {
          return this.$message.error('创建商品失败')
        }
        this.$router.push('/goods')
        this.$message.success('创建商品success')
      })
    }
  
  
  },
  computed:{
    // 分类id
    cateId(){
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang='less' scoped>
  .el-checkbox{
    margin-right: 10px !important;
  }
  .previewImg{
    width: 100%
  }
  .el-button {
    margin-top: 10px
  }
</style>