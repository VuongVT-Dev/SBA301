package fu.se.a2vuongvt_ce191082.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "Category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Short categoryId;

    @NotBlank(message = "Tên danh mục không được để trống")
    @Column(name = "CategoryName", nullable = false)
    private String categoryName;

    @NotBlank(message = "Mô tả danh mục không được để trống")
    @Column(name = "CategoryDesciption", nullable = false)
    private String categoryDescription;

    @Column(name = "ParentCategoryID")
    private Short parentCategoryId;

    @Column(name = "IsActive")
    private Boolean isActive = true;

    public Category() {
    }

    public Short getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Short categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryDescription() {
        return categoryDescription;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }

    public Short getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(Short parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    // Trả về 1 (Active) hoặc 0 (Inactive) đúng theo đề bài
    public Integer getIsActive() {
        return Boolean.TRUE.equals(isActive) ? 1 : 0;
    }

    public void setIsActive(Object value) {
        if (value instanceof Boolean b) {
            this.isActive = b;
        } else if (value instanceof Number n) {
            this.isActive = n.intValue() == 1;
        } else if (value instanceof String s) {
            this.isActive = "1".equals(s.trim()) || "true".equalsIgnoreCase(s.trim());
        } else {
            this.isActive = true;
        }
    }
}
