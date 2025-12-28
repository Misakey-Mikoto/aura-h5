# Aura H5 重启文档

## 服务信息

- **服务名称**: aura-h5.service
- **服务类型**: systemd service
- **运行端口**: 5178
- **监听地址**: 127.0.0.1:5178
- **工作目录**: /root/aura/aura-h5
- **启动脚本**: h5-server.mjs
- **运行用户**: root

## Systemd 服务配置

服务配置文件位置: `/etc/systemd/system/aura-h5.service`

```ini
[Unit]
Description=Aura H5 Node Static Server
After=network.target

[Service]
Type=simple
WorkingDirectory=/root/aura/aura-h5
ExecStart=/usr/bin/node /root/aura/aura-h5/h5-server.mjs
Environment=PORT=5178
Restart=always
RestartSec=3
User=root

[Install]
WantedBy=multi-user.target
```

## 重启操作

### 1. 重启服务

```bash
systemctl restart aura-h5
```

### 2. 查看服务状态

```bash
systemctl status aura-h5
```

### 3. 查看服务日志

```bash
# 查看最新日志
journalctl -u aura-h5 -n 50

# 实时查看日志
journalctl -u aura-h5 -f

# 查看今天的日志
journalctl -u aura-h5 --since today
```

### 4. 停止服务

```bash
systemctl stop aura-h5
```

### 5. 启动服务

```bash
systemctl start aura-h5
```

### 6. 禁用/启用开机自启

```bash
# 禁用开机自启
systemctl disable aura-h5

# 启用开机自启
systemctl enable aura-h5
```

## 更新部署流程

当需要更新 aura-h5 代码后重启服务时，按以下步骤操作：

```bash
# 1. 进入项目目录
cd /root/aura/aura-h5

# 2. 拉取最新代码（如果使用 git）
git pull

# 3. 安装依赖（如有更新）
npm install

# 4. 构建项目
npm run build

# 5. 重启服务
systemctl restart aura-h5

# 6. 验证服务状态
systemctl status aura-h5
```

## 故障排查

### 服务无法启动

1. 检查端口是否被占用：
```bash
netstat -tlnp | grep 5178
# 或
lsof -i :5178
```

2. 检查 Node.js 是否正确安装：
```bash
node --version
which node
```

3. 检查 dist 目录是否存在：
```bash
ls -la /root/aura/aura-h5/dist
```

4. 手动运行服务测试：
```bash
cd /root/aura/aura-h5
node h5-server.mjs
```

### 服务频繁重启

查看详细错误日志：
```bash
journalctl -u aura-h5 -n 100 --no-pager
```

### 修改服务配置后

如果修改了 `/etc/systemd/system/aura-h5.service` 文件，需要重新加载配置：

```bash
# 重新加载 systemd 配置
systemctl daemon-reload

# 重启服务
systemctl restart aura-h5
```

## 常用命令速查

| 命令 | 说明 |
|------|------|
| `systemctl restart aura-h5` | 重启服务 |
| `systemctl status aura-h5` | 查看状态 |
| `systemctl stop aura-h5` | 停止服务 |
| `systemctl start aura-h5` | 启动服务 |
| `journalctl -u aura-h5 -f` | 实时查看日志 |
| `systemctl daemon-reload` | 重载配置 |

## 注意事项

1. 服务配置了自动重启（`Restart=always`），如果进程异常退出会在 3 秒后自动重启
2. 服务监听在 127.0.0.1，只能本地访问，需要通过 Nginx 等反向代理对外提供服务
3. 重启服务前建议先检查构建产物（dist 目录）是否正常
4. 修改环境变量需要编辑 systemd 服务配置文件并重新加载
