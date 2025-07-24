<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  zhCN,
  dateZhCN
} from 'naive-ui';


const ThemeOverrides = {
  common: {
    primaryColor: "#646cff",
    primaryColorSuppl: "#646cff",
    primaryColorHover: "#646cff",
    primaryColorPressed: "#3634b3",
    primaryColorActive: "#646cff1a",
    infoColor: "#646cff",
    infoColorSuppl: "#646cff",
    infoColorHover: "#646cff",
    infoColorPressed: "#3634b3",
    infoColorActive: "#646cff1a",
    successColor: "#52c41a",
    successColorSuppl: "#52c41a",
    successColorHover: "#52c41a",
    successColorPressed: "#237804",
    successColorActive: "#52c41a1a",
    warningColor: "#faad14",
    warningColorSuppl: "#faad14",
    warningColorHover: "#faad14",
    warningColorPressed: "#ad6800",
    warningColorActive: "#faad141a",
    errorColor: "#f5222d",
    errorColorSuppl: "#f5222d",
    errorColorHover: "#f5222d",
    errorColorPressed: "#a8071a",
    errorColorActive: "#f5222d1a",
    borderRadius: "6px"
  },
  LoadingBar: {
    colorLoading: "#646cff"
  },
  Tag: {
    borderRadius: "6px"
  }
};
</script>
<template>
  <!-- 全局配置 Provider（例如颜色主题、尺寸等） -->
  <NConfigProvider :theme-overrides="ThemeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <!-- 对话框 Provider，用于支持 useDialog() 弹出确认框、提示框等 -->
    <NDialogProvider>
      <!-- 通知栏 Provider，用于支持 useNotification() 弹出右上角通知 -->
      <NNotificationProvider>
        <!-- 消息提示 Provider，用于支持 useMessage() 弹出底部的小提示框 -->
        <NMessageProvider>
          <slot />
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NConfigProvider>

</template>
