package com.skm.service.knowledge.entity;

import com.skm.service.knowledge.entity.ServiceKnowledge;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.*;

/**
 * ServiceKnowledge Entity Test - TDD测试先行
 * 验证SQLite兼容的实体注解
 */
@DisplayName("ServiceKnowledge Entity Tests")
class ServiceKnowledgeEntityTest {

    // Test 1: @GeneratedValue with IDENTITY strategy
    @Test
    @DisplayName("@GeneratedValue should use IDENTITY strategy for SQLite")
    void whenEntityHasId_thenGeneratedValueUsesIdentity() throws Exception {
        // This test verifies that the annotation exists and is of type IDENTITY
        // In production, this should be set via reflection or we would need to inspect the class

        // For now, let's just verify the class has the annotation
        try {
            java.lang.reflect.Field idField = ServiceKnowledge.class.getDeclaredField("id");
            GeneratedValue annotation = idField.getAnnotation(GeneratedValue.class);

            assertNotNull(annotation, "ID field should have @GeneratedValue annotation");
            assertEquals(GenerationType.IDENTITY, annotation.strategy(),
                "GeneratedValue strategy should be IDENTITY");
        } catch (Exception e) {
            fail("Should be able to inspect entity: " + e.getMessage());
        }
    }

    // Test 2: Knowledge field should have @Lob and TEXT columnDefinition
    @Test
    @DisplayName("@Lob with TEXT columnDefinition for JSON handling")
    void whenKnowledgeFieldExists_thenShouldHaveLobAndTextAnnotation() throws Exception {
        // Verify the knowledge field has proper annotations for SQLite TEXT type

        try {
            java.lang.reflect.Field knowledgeField = ServiceKnowledge.class.getDeclaredField("knowledge");
            jakarta.persistence.Lob lob = knowledgeField.getAnnotation(jakarta.persistence.Lob.class);
            jakarta.persistence.Column column = knowledgeField.getAnnotation(jakarta.persistence.Column.class);

            assertNotNull(lob, "Knowledge field should have @Lob annotation");
            assertNotNull(column, "Knowledge field should have @Column annotation");

            // Verify columnDefinition is TEXT for SQLite (not JSONB)
            String columnDefinition = column.columnDefinition();
            assertNotNull(columnDefinition, "Column should have columnDefinition");
            assertTrue(columnDefinition.contains("TEXT"),
                      "columnDefinition should include TEXT type");
        } catch (Exception e) {
            fail("Should be able to inspect entity: " + e.getMessage());
        }
    }

    // Test 3: ServiceName field validation
    @Test
    @DisplayName("ServiceName field should have required annotation")
    void whenServiceNameFieldExists_thenShouldHaveNotNullAnnotation() throws Exception {
        try {
            java.lang.reflect.Field serviceNameField = ServiceKnowledge.class.getDeclaredField("serviceName");
            jakarta.persistence.Column column = serviceNameField.getAnnotation(jakarta.persistence.Column.class);

            assertNotNull(column, "ServiceName field should have @Column annotation");
            assertFalse(column.nullable(), "ServiceName should not be nullable");
        } catch (Exception e) {
            fail("Should be able to inspect entity: " + e.getMessage());
        }
    }

    // Test 4: Version field validation
    @Test
    @DisplayName("Version field should have length constraint")
    void whenVersionFieldExists_thenShouldHaveLengthConstraint() throws Exception {
        try {
            java.lang.reflect.Field versionField = ServiceKnowledge.class.getDeclaredField("version");
            jakarta.persistence.Column column = versionField.getAnnotation(jakarta.persistence.Column.class);

            assertNotNull(column, "Version field should have @Column annotation");
            assertTrue(column.length() > 0, "Version should have length constraint");
        } catch (Exception e) {
            fail("Should be able to inspect entity: " + e.getMessage());
        }
    }

    // Test 5: Timestamp fields should have proper annotations
    @Test
    @DisplayName("Timestamp fields should have updatable=false annotation")
    void whenTimestampFieldsExist_thenCreatedAtShouldHaveUpdatableFalse() throws Exception {
        try {
            java.lang.reflect.Field createdAtField = ServiceKnowledge.class.getDeclaredField("createdAt");
            jakarta.persistence.Column createdAtColumn = createdAtField.getAnnotation(jakarta.persistence.Column.class);

            assertNotNull(createdAtColumn, "CreatedAt field should have @Column annotation");
            assertFalse(createdAtColumn.updatable(), "CreatedAt should not be updatable");
        } catch (Exception e) {
            fail("Should be able to inspect entity: " + e.getMessage());
        }
    }
}
