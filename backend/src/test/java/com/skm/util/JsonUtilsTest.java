package com.skm.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

/**
 * JsonUtils 测试类 - TDD测试先行
 */
class JsonUtilsTest {

    // Test 1: toJsonNode - parse valid JSON string
    @Test
    void toJsonNode_parsesValidJsonString_returnsJsonNode() {

    // Test 1: toJsonNode - parse valid JSON string
    @Test
    void toJsonNode_parsesValidJsonString_returnsJsonNode() {
        // Given
        String validJson = "{\"name\": \"test\", \"value\": 123}";

        // When
        JsonNode result = JsonUtils.toJsonNode(validJson);

        // Then
        assertNotNull(result);
        assertEquals("test", result.get("name").asText());
        assertEquals(123, result.get("value").asInt());
    }

    // Test 2: toJsonNode - handles null or empty string
    @Test
    void toJsonNode_withNullString_returnsEmptyObjectNode() {
        // Given
        String nullJson = null;

        // When
        JsonNode result = JsonUtils.toJsonNode(nullJson);

        // Then
        assertNotNull(result);
        assertTrue(result.isObject());
        assertEquals(0, result.size());
    }

    // Test 3: toJsonNode - handles empty string
    @Test
    void toJsonNode_withEmptyString_returnsEmptyObjectNode() {
        // Given
        String emptyJson = "   ";

        // When
        JsonNode result = JsonUtils.toJsonNode(emptyJson);

        // Then
        assertNotNull(result);
        assertTrue(result.isObject());
        assertEquals(0, result.size());
    }

    // Test 4: toJsonNode - handles invalid JSON gracefully
    @Test
    void toJsonNode_withInvalidJson_returnsEmptyObjectNode() {
        // Given
        String invalidJson = "{invalid json}";

        // When
        JsonNode result = JsonUtils.toJsonNode(invalidJson);

        // Then
        assertNotNull(result);
        assertTrue(result.isObject());
        assertEquals(0, result.size());
    }

    // Test 5: toJsonNode - parses array
    @Test
    void toJsonNode_parsesJsonArray_returnsArrayNode() {
        // Given
        String arrayJson = "[1, 2, 3]";

        // When
        JsonNode result = JsonUtils.toJsonNode(arrayJson);

        // Then
        assertNotNull(result);
        assertTrue(result.isArray());
        assertEquals(3, result.size());
    }

    // Test 6: toJsonString - serializes JsonNode to string
    @Test
    void toJsonString_serializesJsonNode_returnsJsonString() {
        // Given
        ObjectNode node = new ObjectMapper().createObjectNode();
        JsonNode objectMapperNode = node; // Store as JsonNode type
        node.put("name", "test");
        node.put("value", 123);

        // When
        String result = JsonUtils.toJsonString(node);

        // Then
        assertNotNull(result);
        assertEquals("{\"name\":\"test\",\"value\":123}", result);
    }

    // Test 7: toJsonString - handles null node
    @Test
    void toJsonString_withNullNode_returnsEmptyJsonObject() {
        // Given
        JsonNode nullNode = null;

        // When
        String result = JsonUtils.toJsonString(nullNode);

        // Then
        assertEquals("{}", result);
    }

    // Test 8: toJsonString - handles missing node
    @Test
    void toJsonString_withMissingNode_returnsEmptyJsonObject() {
        // Given
        JsonNode missingNode = new ObjectMapper().createObjectNode().missingNode();

        // When
        String result = JsonUtils.toJsonString(missingNode);

        // Then
        assertEquals("{}", result);
    }

    // Test 9: toJsonString - serializes empty object
    @Test
    void toJsonString_withEmptyObject_returnsEmptyJsonObject() {
        // Given
        ObjectNode emptyNode = new ObjectMapper().createObjectNode();

        // When
        String result = JsonUtils.toJsonString(emptyNode);

        // Then
        assertEquals("{}", result);
    }

    // Test 10: toJsonString - serializes array
    @Test
    void toJsonString_serializesArrayNode_returnsJsonArrayString() {
        // Given
        JsonNode arrayNode = new ObjectMapper().createArrayNode();
        arrayNode.add(1);
        arrayNode.add(2);
        arrayNode.add(3);

        // When
        String result = JsonUtils.toJsonString(arrayNode);

        // Then
        assertEquals("[1,2,3]", result);
    }

    // Test 11: Complex JSON with nested objects
    @Test
    void toJsonNode_parsesComplexNestedJson_returnsCorrectStructure() {
        // Given
        String complexJson = "{\"api\": {\"endpoints\": [{\"method\": \"GET\"}]}}";

        // When
        JsonNode result = JsonUtils.toJsonNode(complexJson);

        // Then
        assertNotNull(result);
        assertTrue(result.isObject());
        assertTrue(result.has("api"));
        assertEquals("GET", result.get("api").get("endpoints").get(0).get("method").asText());
    }

    // Test 12: JSON with special characters
    @Test
    void toJsonNode_handlesJsonWithSpecialCharacters_returnsCorrectNode() {
        // Given
        String jsonWithSpecialChars = "{\"name\": \"test\\\"quote\", \"value\": \"new\\nline\"}";

        // When
        JsonNode result = JsonUtils.toJsonNode(jsonWithSpecialChars);

        // Then
        assertNotNull(result);
        assertEquals("test\"quote", result.get("name").asText());
        assertEquals("new\nline", result.get("value").asText());
    }
}
