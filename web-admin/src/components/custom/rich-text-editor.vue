<!-- 富文本 -->

<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入样式
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 编辑器实例
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//   }, 1500)
// })

// 工具栏配置
const toolbarConfig = {}

// 编辑器配置，包括 base64 图片粘贴支持
const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      base64LimitSize: 500 * 1024, // 500KB 以下转 base64
    },
  },
}

// 销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

// 创建回调
const handleCreated = (editor) => {
  editorRef.value = editor
}

// 模式：default（完整模式-写文章、评论、富文本编辑等完整功能） 或 simple（简洁模式-聊天输入框、轻量备注等）
const mode = 'default'
</script>

<template>
  <BaseCard>
    <div style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
  </BaseCard>
</template>

<style scoped>
:deep(.w-e-toolbar) {
  background: inherit !important;
  border-color: #999 !important;
}
:deep(.w-e-text-container) {
  background: inherit;
  border-color: #999 !important;
}
</style>
