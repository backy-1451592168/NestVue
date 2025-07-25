<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useFormRules, useNaiveForm } from '@/utils/common/form.ts';
import apis from "@/api/login";
import type { FormItemRule } from 'naive-ui';
import message from '@/utils/naiveui/message.ts';
// import { mainStore } from '@/stores';

const router = useRouter();
const route = useRoute();

const { formRules } = useFormRules();

interface FormModel {
  userName: string;
  password: string;
}
const model: FormModel = reactive({
  userName: '',
  password: '123456'
});

const rules: Record<keyof FormModel, FormItemRule[]> = {
  userName: formRules.userName,
  password: formRules.pwd,
};

const rememberMe = ref(false);
// 初始化记住用户名
const storedUserName = localStorage.getItem('rememberUserName');
if (storedUserName) {
  model.userName = storedUserName;
  rememberMe.value = true;
}

const { formRef, validate } = useNaiveForm();

const loginLoading = ref(false);
// 登录
const handleSubmit = async () => {
  await validate();
  loginLoading.value = true;
  apis.loginUwk({
    user_name: model.userName,
    password: model.password,
  }).then(res => {
    if (res.code !== 201) return;
    // 保存 tekon
    localStorage.setItem('SOY_token', res.data.token);
    localStorage.setItem('SOY_refreshToken', res.data.refreshToken);

    if (rememberMe.value) {
      localStorage.setItem('rememberUserName', model.userName);
    } else {
      localStorage.removeItem('rememberUserName');
    }

    const redirectPath = route.query.redirect as string;
    router.replace(redirectPath || '/manage/browseData');
    // 跳转路由
  }).finally(() => {
    loginLoading.value = false;
  });
};

const toggleLoginModule = () => {
  message.success('请联系开发者！');
};
</script>

<template>
  <div class="relative w-full flex items-center flex-center justify-center overflow-hidden bg-[#e1ddfd]">
    <WaveBg />
    <NCard :bordered="false" class="relative z-[4] rounded-[12px] !w-auto !rounded-[12px]">
      <div class="w-[400px] max-sm:w-[300px]">
        <header class="flex items-center">
          <h3 class="text-[28px] !font-medium text-primary max-sm:text-[22px]">管理系统</h3>
        </header>
        <main class="pt-[24px]">
          <NForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false"
            @keyup.enter="handleSubmit">
            <NFormItem path="userName">
              <NInput v-model:value="model.userName" placeholder="请输入用户名" />
            </NFormItem>
            <NFormItem path="password">
              <NInput v-model:value="model.password" type="password" show-password-on="click" placeholder="请输入密码" />
            </NFormItem>
            <NSpace vertical :size="24">
              <div class="flex items-center justify-between">
                <NCheckbox v-model:checked="rememberMe">记住我</NCheckbox>
                <div @click="toggleLoginModule()">
                  忘记密码？
                </div>
              </div>
              <NButton type="primary" size="large" round block :loading="loginLoading" @click="handleSubmit">
                确定
              </NButton>
            </NSpace>
          </NForm>
        </main>
      </div>
    </NCard>
  </div>
</template>
