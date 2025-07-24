import { defineStore } from 'pinia';

interface UserInfo {
  id: number;
  user_name: string;
  // 你可以根据实际接口加字段
}

export const mainStore = defineStore('main', {
  // id: 'main',
  state: () => ({
    token: '' as string,
    refreshToken: '' as string,
    userInfo: null as UserInfo | null,
  }),

  getters: {
    isLogin: (state) => !!state.token,
  },

  actions: {
    // 设置登录信息
    setLogin(payload: { token: string; refreshToken: string; userInfo: UserInfo }) {
      this.token = payload.token;
      this.refreshToken = payload.refreshToken;
      this.userInfo = payload.userInfo;
    },

    // 重置所有用户信息（退出登录）
    reset() {
      this.token = '';
      this.refreshToken = '';
      this.userInfo = null;
    },
  },
});
