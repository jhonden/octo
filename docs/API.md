# API 文档

本文档描述了Octo服务知识管理系统的所有API接口。

## 基础信息

### 基础URL

```
开发环境: http://localhost:8080
生产环境: <待定>
```

### 认证

当前版本未实现认证，后续将添加JWT认证。

### 响应格式

**成功响应：**
```json
{
  "data": { /* 数据对象 */ }
}
```

**错误响应：**
```json
{
  "message": "错误描述",
  "code": "ERROR_CODE"
}
```

### 状态码

| 状态码 | 描述 |
|-------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 服务知识API

### 获取所有服务

获取系统中所有服务列表。

**请求：**
```
GET /api/service-knowledge
```

**响应示例：**
```json
[
  {
    "id": 1,
    "serviceName": "user-service",
    "version": "1.0.0",
    "knowledge": "{\"api_endpoints\": [...]}",
    "createdAt": "2024-01-01T00:00:00",
    "updatedAt": "2024-01-01T00:00:00"
  },
  {
    "id": 2,
    "serviceName": "order-service",
    "version": "2.1.0",
    "knowledge": "{\"api_endpoints\": [...]}",
    "createdAt": "2024-01-02T00:00:00",
    "updatedAt": "2024-01-02T00:00:00"
  }
]
```

### 获取单个服务

根据ID获取指定服务的详细信息。

**请求：**
```
GET /api/service-knowledge/{id}
```

**路径参数：**
| 参数 | 类型 | 必需 | 描述 |
|-----|------|------|------|
| id | Long | 是 | 服务ID |

**响应示例：**
```json
{
  "id": 1,
  "serviceName": "user-service",
  "version": "1.0.0",
  "knowledge": "{\"api_endpoints\": [...]}",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

### 创建服务

创建新的服务知识条目。

**请求：**
```
POST /api/service-knowledge
Content-Type: application/json
```

**请求体：**
```json
{
  "serviceName": "user-service",
  "version": "1.0.0"
}
```

**字段说明：**
| 字段 | 类型 | 必需 | 描述 |
|-----|------|------|------|
| serviceName | String | 是 | 服务名称 |
| version | String | 是 | 版本号 |

**响应示例：**
```json
{
  "id": 1,
  "serviceName": "user-service",
  "version": "1.0.0",
  "knowledge": null,
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T00:00:00"
}
```

### 更新服务

更新指定服务的信息。

**请求：**
```
PUT /api/service-knowledge/{id}
Content-Type: application/json
```

**路径参数：**
| 参数 | 类型 | 必需 | 描述 |
|-----|------|------|------|
| id | Long | 是 | 服务ID |

**请求体：**
```json
{
  "serviceName": "user-service",
  "version": "1.0.1",
  "knowledge": "{\"api_endpoints\": [...]}"
}
```

**字段说明：**
| 字段 | 类型 | 必需 | 描述 |
|-----|------|------|------|
| serviceName | String | 否 | 服务名称 |
| version | String | 否 | 版本号 |
| knowledge | String | 否 | JSON格式的知识数据 |

**响应示例：**
```json
{
  "id": 1,
  "serviceName": "user-service",
  "version": "1.0.1",
  "knowledge": "{\"api_endpoints\": [...]}",
  "createdAt": "2024-01-01T00:00:00",
  "updatedAt": "2024-01-01T12:00:00"
}
```

### 删除服务

删除指定的服务。

**请求：**
```
DELETE /api/service-knowledge/{id}
```

**路径参数：**
| 参数 | 类型 | 必需 | 描述 |
|-----|------|------|------|
| id | Long | 是 | 服务ID |

**响应：**
```
HTTP 204 No Content
```

---

## 知识数据结构

知识数据存储在`knowledge`字段中，为JSON格式。

### API端点结构

```json
{
  "api_endpoints": [
    {
      "method": "GET",
      "path": "/api/users",
      "description": "获取用户列表",
      "parameters": [
        {
          "name": "page",
          "type": "integer",
          "required": false,
          "description": "页码"
        },
        {
          "name": "size",
          "type": "integer",
          "required": false,
          "description": "每页大小"
        }
      ],
      "returnType": "List<User>"
    },
    {
      "method": "POST",
      "path": "/api/users",
      "description": "创建用户",
      "parameters": [
        {
          "name": "user",
          "type": "User",
          "required": true,
          "description": "用户信息"
        }
      ],
      "returnType": "User"
    }
  ]
}
```

### 字段说明

#### API端点对象

| 字段 | 类型 | 描述 |
|-----|------|------|
| method | String | HTTP方法 (GET, POST, PUT, DELETE) |
| path | String | API路径 |
| description | String | API描述 |
| parameters | Array | 参数列表 |
| returnType | String | 返回类型 |

#### 参数对象

| 字段 | 类型 | 描述 |
|-----|------|------|
| name | String | 参数名称 |
| type | String | 参数类型 |
| required | Boolean | 是否必填 |
| description | String | 参数描述 |

---

## 错误码

| 错误码 | 描述 |
|-------|------|
| VALIDATION_ERROR | 请求参数验证失败 |
| NOT_FOUND | 资源不存在 |
| INTERNAL_ERROR | 服务器内部错误 |
| DUPLICATE_ERROR | 重复数据错误 |

### 错误响应示例

**验证错误：**
```json
{
  "message": "Service name is required",
  "code": "VALIDATION_ERROR"
}
```

**未找到错误：**
```json
{
  "message": "Service not found with id: 999",
  "code": "NOT_FOUND"
}
```

---

## 使用示例

### JavaScript/React

```javascript
import { serviceKnowledgeAPI } from '../api/api';

// 获取所有服务
const getAllServices = async () => {
  try {
    const response = await serviceKnowledgeAPI.getAll();
    console.log('Services:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};

// 创建服务
const createService = async (serviceData) => {
  try {
    const response = await serviceKnowledgeAPI.create(serviceData);
    console.log('Created service:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create service:', error);
    throw error;
  }
};

// 更新服务
const updateService = async (id, serviceData) => {
  try {
    const response = await serviceKnowledgeAPI.update(id, serviceData);
    console.log('Updated service:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to update service:', error);
    throw error;
  }
};

// 删除服务
const deleteService = async (id) => {
  try {
    await serviceKnowledgeAPI.delete(id);
    console.log('Deleted service:', id);
  } catch (error) {
    console.error('Failed to delete service:', error);
    throw error;
  }
};
```

### cURL

```bash
# 获取所有服务
curl -X GET http://localhost:8080/api/service-knowledge

# 创建服务
curl -X POST http://localhost:8080/api/service-knowledge \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "user-service",
    "version": "1.0.0"
  }'

# 更新服务
curl -X PUT http://localhost:8080/api/service-knowledge/1 \
  -H "Content-Type: application/json" \
  -d '{
    "serviceName": "user-service",
    "version": "1.0.1"
  }'

# 删除服务
curl -X DELETE http://localhost:8080/api/service-knowledge/1
```

---

## 待实现功能

以下功能正在规划中，尚未实现：

- [ ] 用户认证和授权
- [ ] 知识分析API
- [ ] 仓库管理API
- [ ] 批量操作API
- [ ] 搜索和过滤API
- [ ] 导入导出功能

---

**最后更新：2024年3月**
