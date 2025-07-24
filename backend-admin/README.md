# backend-admin
## node 20.19.3

| code   | 含义说明                    | 前端处理逻辑                |
| ------ | ----------------------- | --------------------- |
| `200` | 请求成功                   | 无需处理              |
| `201` | 登录成功                   | 进入需要权限的页面              |
| `4001` | **缺少 token**（未登录）       | 直接跳转到登录页              |
| `4002` | **token 无效或已过期**        | 尝试用 `refreshToken` 刷新 |
| `4003` | **缺少 refreshToken**     | 退出登录，跳登录页             |
| `4004` | **refreshToken 无效或已过期** | 退出登录，跳登录页             |


### Development

```bash
npm i
npm run dev
open http://localhost:7001/
```

### Deploy

```bash
npm start
npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

[egg]: https://eggjs.org
