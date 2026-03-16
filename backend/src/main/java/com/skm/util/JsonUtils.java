package com.skm.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * JSON 序列化/反序列化工具类
 * 用于处理 SQLite 数据库中的 TEXT 类型 JSON 字段
 */
public class JsonUtils {

    private static final Logger log = LoggerFactory.getLogger(JsonUtils.class);
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 将 JSON 字符串转换为 JsonNode
     *
     * @param jsonText JSON 字符串
     * @return JsonNode 对象，如果解析失败或为空则返回空对象
     */
    public static JsonNode toJsonNode(String jsonText) {
        if (jsonText == null || jsonText.trim().isEmpty()) {
            return objectMapper.createObjectNode();
        }
        try {
            return objectMapper.readTree(jsonText);
        } catch (JsonProcessingException e) {
            log.error("Failed to parse JSON: {}", jsonText, e);
            return objectMapper.createObjectNode();
        }
    }

    /**
     * 将 JsonNode 转换为 JSON 字符串
     *
     * @param jsonNode JsonNode 对象
     * @return JSON 字符串，如果为空或null则返回"{}"
     */
    public static String toJsonString(JsonNode jsonNode) {
        if (jsonNode == null || jsonNode.isMissingNode()) {
            return "{}";
        }
        try {
            return objectMapper.writeValueAsString(jsonNode);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize JSON", e);
            return "{}";
        }
    }
}
